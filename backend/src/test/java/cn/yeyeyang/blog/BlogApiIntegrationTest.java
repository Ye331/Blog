package cn.yeyeyang.blog;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import jakarta.servlet.http.Cookie;

import cn.yeyeyang.blog.auth.BlogSessionProperties;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.mock.web.MockMultipartFile;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class BlogApiIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void publicReadEndpointsDoNotRequireLogin() throws Exception {
        mockMvc.perform(get("/api/posts"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(0)));

        mockMvc.perform(get("/api/profile"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.avatar").value("/avatar.jpg"));
    }

    @Test
    void writeEndpointsRequireLogin() throws Exception {
        mockMvc.perform(post("/api/posts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(validPostJson("Blocked Post")))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.error").value("Unauthorized"));

        mockMvc.perform(put("/api/profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content(validProfileJson("Blocked Author")))
            .andExpect(status().isUnauthorized());

        MockMultipartFile image = new MockMultipartFile("file", "cover.png", "image/png", pngBytes());
        mockMvc.perform(multipart("/api/uploads/images").file(image))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void invalidLoginReturnsUnauthorized() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"admin\",\"password\":\"wrong\"}"))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.error").value("Invalid username or password"));
    }

    @Test
    void authenticatedAdminCanManagePostsAndProfile() throws Exception {
        Cookie sessionCookie = login();

        mockMvc.perform(get("/api/auth/me").cookie(sessionCookie))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.user.role").value("admin"));

        MvcResult createResult = mockMvc.perform(post("/api/posts")
                .cookie(sessionCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(validPostJson("A New Essay")))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.title").value("A New Essay"))
            .andExpect(jsonPath("$.date").exists())
            .andReturn();

        String createdId = JsonTestSupport.readString(createResult.getResponse().getContentAsString(), "id");

        mockMvc.perform(put("/api/posts/" + createdId)
                .cookie(sessionCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(validPostJson("An Updated Essay")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title").value("An Updated Essay"));

        mockMvc.perform(put("/api/profile")
                .cookie(sessionCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(validProfileJson("Yeye Yang")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Yeye Yang"));

        mockMvc.perform(delete("/api/posts/" + createdId).cookie(sessionCookie))
            .andExpect(status().isNoContent());
    }

    @Test
    void authenticatedAdminCanUploadImages() throws Exception {
        Cookie sessionCookie = login();
        MockMultipartFile image = new MockMultipartFile("file", "cover.png", "image/png", pngBytes());

        MvcResult uploadResult = mockMvc.perform(multipart("/api/uploads/images")
                .file(image)
                .cookie(sessionCookie))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.url").value(containsString("/uploads/")))
            .andReturn();

        String uploadedUrl = JsonTestSupport.readString(uploadResult.getResponse().getContentAsString(), "url");
        mockMvc.perform(get(uploadedUrl))
            .andExpect(status().isOk());
    }

    @Test
    void imageUploadRejectsUnsupportedTypes() throws Exception {
        Cookie sessionCookie = login();
        MockMultipartFile textFile = new MockMultipartFile("file", "note.txt", "text/plain", "not an image".getBytes());

        mockMvc.perform(multipart("/api/uploads/images")
                .file(textFile)
                .cookie(sessionCookie))
            .andExpect(status().isBadRequest());
    }

    @Test
    void imageUploadRejectsOversizedFiles() throws Exception {
        Cookie sessionCookie = login();
        MockMultipartFile image = new MockMultipartFile("file", "large.png", "image/png", oversizedPngBytes());

        mockMvc.perform(multipart("/api/uploads/images")
                .file(image)
                .cookie(sessionCookie))
            .andExpect(status().isBadRequest());
    }

    @Test
    void logoutRevokesSessionCookie() throws Exception {
        Cookie sessionCookie = login();

        mockMvc.perform(post("/api/auth/logout").cookie(sessionCookie))
            .andExpect(status().isNoContent())
            .andExpect(header().string(HttpHeaders.SET_COOKIE, containsString("Max-Age=0")));

        mockMvc.perform(get("/api/auth/me").cookie(sessionCookie))
            .andExpect(status().isUnauthorized());
    }

    private Cookie login() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"admin\",\"password\":\"secret\"}"))
            .andExpect(status().isOk())
            .andExpect(cookie().exists(BlogSessionProperties.COOKIE_NAME))
            .andExpect(header().string(HttpHeaders.SET_COOKIE, containsString("HttpOnly")))
            .andExpect(header().string(HttpHeaders.SET_COOKIE, containsString("SameSite=Lax")))
            .andReturn();

        return result.getResponse().getCookie(BlogSessionProperties.COOKIE_NAME);
    }

    private String validPostJson(String title) {
        return """
            {
              "title": "%s",
              "content": "Body content for the essay.",
              "excerpt": "Short summary.",
              "category": "Notes",
              "readTime": "1 min read",
              "coverImage": "https://example.com/cover.jpg"
            }
            """.formatted(title);
    }

    private byte[] pngBytes() {
        return new byte[] {(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00};
    }

    private byte[] oversizedPngBytes() {
        byte[] bytes = new byte[(5 * 1024 * 1024) + 1];
        byte[] header = pngBytes();
        System.arraycopy(header, 0, bytes, 0, header.length);
        return bytes;
    }

    private String validProfileJson(String name) {
        return """
            {
              "name": "%s",
              "title": "Writer",
              "bio": "Personal notes.",
              "avatar": "/avatar.jpg",
              "github": "https://github.com",
              "twitter": "https://twitter.com",
              "email": "hello@example.com"
            }
            """.formatted(name);
    }
}
