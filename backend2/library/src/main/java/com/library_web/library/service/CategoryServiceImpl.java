package com.library_web.library.service;

import com.library_web.library.model.Category;
import com.library_web.library.model.CategoryChild;
import com.library_web.library.dto.CategoryWithChildrenNames;
import com.library_web.library.repository.CategoryRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepo;

    public CategoryServiceImpl(CategoryRepository categoryRepo) {
        this.categoryRepo = categoryRepo;
    }

    @Override
    public List<Category> getAll() {
        return categoryRepo.findAll();
    }

    @Override
public Category addCategory(CategoryWithChildrenNames payload) {
    if (categoryRepo.existsByName(payload.getName())) {
        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST, "Danh mục cha '" + payload.getName() + "' đã tồn tại.");
    }

    List<String> names = payload.getChildrenNames();
    Set<String> uniqueNames = new HashSet<>(names);
    if (uniqueNames.size() < names.size()) {
        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST, "Có danh mục con trùng tên.");
    }

    Category category = new Category();
    category.setName(payload.getName());
    Category saved = categoryRepo.save(category); 
    for (int i = 0; i < names.size(); i++) {
        String suffix = generateSuffix(i);
        CategoryChild child = new CategoryChild(saved, suffix, names.get(i));
        saved.addChild(child);
    }
    return categoryRepo.save(saved);
}

    @Override
    public Category updateCategory(Long id, Map<String, String> updates) {
        Category category = categoryRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục: " + id));
        if (updates.containsKey("name")) {
            category.setName(updates.get("name"));
        }
        return categoryRepo.save(category);
    }

    @Override
    public void deleteCategory(Long id) {
        categoryRepo.deleteById(id);
    }

    private String generateSuffix(int index) {
        StringBuilder sb = new StringBuilder();
        index++; // 1-based
        while (index > 0) {
            index--;
            sb.insert(0, (char) ('a' + (index % 26)));
            index /= 26;
        }
        return sb.toString();
    }

    @Override
    public Category findById(Long id) {
        return categoryRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục: " + id));
    }
}