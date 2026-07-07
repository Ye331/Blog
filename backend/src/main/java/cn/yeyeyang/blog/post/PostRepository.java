package cn.yeyeyang.blog.post;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<PostEntity, String> {
    List<PostEntity> findAllByOrderByCreatedAtDesc();
}
