package cn.yeyeyang.blog.config;

import java.nio.file.Path;

import cn.yeyeyang.blog.upload.UploadProperties;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class UploadsWebConfig implements WebMvcConfigurer {
    private final UploadProperties uploadProperties;

    public UploadsWebConfig(UploadProperties uploadProperties) {
        this.uploadProperties = uploadProperties;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String location = Path.of(uploadProperties.dir()).toAbsolutePath().normalize().toUri().toString();
        if (!location.endsWith("/")) {
            location = location + "/";
        }
        registry.addResourceHandler("/uploads/**")
            .addResourceLocations(location);
    }
}
