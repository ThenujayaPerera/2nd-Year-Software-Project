package com.example.back_end.controller;

import com.example.back_end.entity.HeroSlide;
import com.example.back_end.entity.ShowroomPhoto;
import com.example.back_end.repository.HeroSlideRepository;
import com.example.back_end.repository.ShowroomPhotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/home")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"})
public class HomeConfigController {

    @Autowired
    private HeroSlideRepository heroSlideRepository;

    @Autowired
    private ShowroomPhotoRepository showroomPhotoRepository;

    // --- Hero Slides ---
    @GetMapping("/slides")
    public List<HeroSlide> getHeroSlides() {
        return heroSlideRepository.findAll();
    }

    @PostMapping("/slides")
    public HeroSlide createHeroSlide(@RequestBody HeroSlide slide) {
        return heroSlideRepository.save(slide);
    }

    @PutMapping("/slides/{id}")
    public ResponseEntity<HeroSlide> updateHeroSlide(@PathVariable Long id, @RequestBody HeroSlide slideDetails) {
        HeroSlide slide = heroSlideRepository.findById(id).orElseThrow();
        slide.setTitle(slideDetails.getTitle());
        slide.setSubtitle(slideDetails.getSubtitle());
        slide.setImage(slideDetails.getImage());
        slide.setCta(slideDetails.getCta());
        slide.setLink(slideDetails.getLink());
        slide.setColor(slideDetails.getColor());
        return ResponseEntity.ok(heroSlideRepository.save(slide));
    }

    @DeleteMapping("/slides/{id}")
    public ResponseEntity<?> deleteHeroSlide(@PathVariable Long id) {
        heroSlideRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- Showroom Photos ---
    @GetMapping("/showroom")
    public List<ShowroomPhoto> getShowroomPhotos() {
        return showroomPhotoRepository.findAll();
    }

    @PostMapping("/showroom")
    public ShowroomPhoto createShowroomPhoto(@RequestBody ShowroomPhoto photo) {
        return showroomPhotoRepository.save(photo);
    }

    @PutMapping("/showroom/{id}")
    public ResponseEntity<ShowroomPhoto> updateShowroomPhoto(@PathVariable Long id, @RequestBody ShowroomPhoto photoDetails) {
        ShowroomPhoto photo = showroomPhotoRepository.findById(id).orElseThrow();
        photo.setTag(photoDetails.getTag());
        photo.setTagColor(photoDetails.getTagColor());
        photo.setTitle(photoDetails.getTitle());
        photo.setSubtitle(photoDetails.getSubtitle());
        photo.setFullDesc(photoDetails.getFullDesc());
        photo.setImage(photoDetails.getImage());
        photo.setGridClass(photoDetails.getGridClass());
        return ResponseEntity.ok(showroomPhotoRepository.save(photo));
    }

    @DeleteMapping("/showroom/{id}")
    public ResponseEntity<?> deleteShowroomPhoto(@PathVariable Long id) {
        showroomPhotoRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
