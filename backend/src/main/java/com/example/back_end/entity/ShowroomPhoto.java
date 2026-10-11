package com.example.back_end.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "showroom_photos")
public class ShowroomPhoto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tag;
    private String tagColor;
    private String title;
    private String subtitle;
    
    @Column(length = 2000)
    private String fullDesc;
    
    private String image;
    private String gridClass;

    public ShowroomPhoto() {}

    public ShowroomPhoto(String tag, String tagColor, String title, String subtitle, String fullDesc, String image, String gridClass) {
        this.tag = tag;
        this.tagColor = tagColor;
        this.title = title;
        this.subtitle = subtitle;
        this.fullDesc = fullDesc;
        this.image = image;
        this.gridClass = gridClass;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }
    public String getTagColor() { return tagColor; }
    public void setTagColor(String tagColor) { this.tagColor = tagColor; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
    public String getFullDesc() { return fullDesc; }
    public void setFullDesc(String fullDesc) { this.fullDesc = fullDesc; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getGridClass() { return gridClass; }
    public void setGridClass(String gridClass) { this.gridClass = gridClass; }
}
