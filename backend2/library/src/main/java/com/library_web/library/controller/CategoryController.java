package com.library_web.library.controller;
import com.library_web.library.dto.CategoryDTO;
import com.library_web.library.dto.CategoryWithChildrenNames;
import com.library_web.library.dto.CategoryChildDTO;
import com.library_web.library.model.Category;
import com.library_web.library.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/category")
@CrossOrigin
public class CategoryController {
    private final CategoryService service;
    public CategoryController(CategoryService service) {
        this.service = service;
    }

    @GetMapping
    public List<CategoryDTO> getAll() {
        return service.getAll().stream()
            .map(cat -> {
                var childs = cat.getChildren().stream()
                    .map(ch -> new CategoryChildDTO(
                        ch.getId(), ch.getName(),
                        cat.getId(), cat.getName()
                    ))
                    .collect(Collectors.toList());
                return new CategoryDTO(cat.getId(), cat.getName(), cat.getSoLuongDanhMuc(), childs);
            })
            .collect(Collectors.toList());
    }

    @PostMapping
    public CategoryDTO add(@RequestBody CategoryWithChildrenNames payload) {
        Category c = service.addCategory(payload);
        var childs = c.getChildren().stream()
            .map(ch -> new CategoryChildDTO(
                ch.getId(), ch.getName(),
                c.getId(), c.getName()
            ))
            .collect(Collectors.toList());
        return new CategoryDTO(c.getId(), c.getName(), c.getSoLuongDanhMuc(), childs);
    }

    @PatchMapping("/{id}")
    public CategoryDTO update(@PathVariable Long id,
                            @RequestBody Map<String,String> updates) {
        Category c = service.updateCategory(id, updates);
        var childs = c.getChildren().stream()
            .map(ch -> new CategoryChildDTO(
                ch.getId(), ch.getName(),
                c.getId(), c.getName()
            )).toList();
        return new CategoryDTO(c.getId(), c.getName(), c.getSoLuongDanhMuc(), childs);
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.deleteCategory(id);
    }

    @GetMapping("/{id}")
    public CategoryDTO getById(@PathVariable Long id) {
        Category c = service.findById(id); 
        var childs = c.getChildren().stream()
            .map(ch -> new CategoryChildDTO(
                ch.getId(), ch.getName(),
                c.getId(), c.getName()
            ))
            .collect(Collectors.toList());
        return new CategoryDTO(c.getId(), c.getName(), c.getSoLuongDanhMuc(), childs);
    }

}