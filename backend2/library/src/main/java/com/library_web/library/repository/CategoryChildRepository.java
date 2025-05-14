package com.library_web.library.repository;

import com.library_web.library.model.CategoryChild;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryChildRepository extends JpaRepository<CategoryChild, String> {
   Optional<CategoryChild> findChildById(String id);
    Optional<CategoryChild> findByName(String name);
    List<CategoryChild> findByParentIdOrderByIdAsc(Long parentId);
    Optional<CategoryChild> findByNameAndParentId(String name, Long parentId);
}
