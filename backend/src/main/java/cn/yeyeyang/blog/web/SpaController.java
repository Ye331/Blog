package cn.yeyeyang.blog.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {
    @GetMapping({"/", "/studio-a7ed8f996c916a75"})
    public String index() {
        return "forward:/index.html";
    }
}
