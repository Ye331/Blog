package cn.yeyeyang.blog.upload;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "blog.uploads")
public record UploadProperties(String dir) {
}
