package cn.yeyeyang.blog.config;

import java.io.IOException;

import cn.yeyeyang.blog.auth.AdminProperties;
import cn.yeyeyang.blog.auth.BlogSessionProperties;
import cn.yeyeyang.blog.auth.CookieAuthenticationFilter;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableConfigurationProperties({AdminProperties.class, BlogSessionProperties.class})
public class SecurityConfig {
    @Bean
    SecurityFilterChain securityFilterChain(
        HttpSecurity http,
        CookieAuthenticationFilter cookieAuthenticationFilter
    ) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(cookieAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.GET, "/api/posts", "/api/posts/*", "/api/profile").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/login", "/api/auth/logout").permitAll()
                .requestMatchers("/", "/index.html", "/studio-a7ed8f996c916a75", "/studio-a7ed8f996c916a75/**", "/assets/**", "/avatar.jpg").permitAll()
                .requestMatchers("/api/**").authenticated()
                .anyRequest().permitAll()
            )
            .exceptionHandling(errors -> errors.authenticationEntryPoint((request, response, exception) -> {
                response.setStatus(401);
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                writeJsonError(response);
            }))
            .build();
    }

    private void writeJsonError(jakarta.servlet.http.HttpServletResponse response) throws IOException {
        response.getWriter().write("{\"error\":\"Unauthorized\"}");
    }
}
