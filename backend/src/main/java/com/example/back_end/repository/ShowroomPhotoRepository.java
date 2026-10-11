package com.example.back_end.repository;

import com.example.back_end.entity.ShowroomPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShowroomPhotoRepository extends JpaRepository<ShowroomPhoto, Long> {
}
