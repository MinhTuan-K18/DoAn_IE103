package com.library_web.library.controller;

import com.library_web.library.dto.CategoryChildDTO;
import com.library_web.library.model.CategoryChild;
import com.library_web.library.service.CategoryChildService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/category-child")
@CrossOrigin
public class CategoryChildController {
    private final CategoryChildService service;
    public CategoryChildController(CategoryChildService service) {
        this.service = service;
    }

    @GetMapping("/category/{categoryId}")
    public List<CategoryChildDTO> getByCategory(@PathVariable Long categoryId) {
        return service.getByCategory(categoryId).stream()
            .map(ch -> new CategoryChildDTO(
                ch.getId(), ch.getName(),
                ch.getParent().getId(), ch.getParent().getName()
            ))
            .collect(Collectors.toList());
    }

    @PostMapping("/category/{categoryId}/add")
    public CategoryChildDTO addChild(
        @PathVariable Long categoryId,
        @RequestBody Map<String, String> body
    ) {
        String name = body.get("name");
        CategoryChild ch = service.addChild(categoryId, name);
        return new CategoryChildDTO(
            ch.getId(), ch.getName(),
            categoryId, ch.getCategoryName()
        );
    }

    @PatchMapping("/{id}")
    public CategoryChildDTO updateChild(
        @PathVariable String id,
        @RequestBody Map<String, String> body
    ) {
        String newName = body.get("name");
        CategoryChild ch = service.updateChild(id, newName);
        return new CategoryChildDTO(
            ch.getId(), ch.getName(),
            ch.getParent().getId(), ch.getCategoryName()
        );
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteChild(@PathVariable String id) {
        service.deleteChild(id);
    }
   
    @GetMapping("/{id}")
    public CategoryChildDTO getById(@PathVariable String id) {
    CategoryChild ch = service.findChildById(id);
    return new CategoryChildDTO(
        ch.getId(), ch.getName(),
        ch.getParent().getId(), ch.getCategoryName()
    );
    }

}
