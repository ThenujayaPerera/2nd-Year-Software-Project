package com.example.back_end.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "hero_slides")
public class HeroSlide {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String subtitle;
    private String image;
    private String cta;
    private String link;
    private String color;

    public HeroSlide() {}

    public HeroSlide(String title, String subtitle, String image, String cta, String link, String color) {
        this.title = title;
        this.subtitle = subtitle;
        this.image = image;
        this.cta = cta;
        this.link = link;
        this.color = color;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getCta() { return cta; }
    public void setCta(String cta) { this.cta = cta; }
    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}
