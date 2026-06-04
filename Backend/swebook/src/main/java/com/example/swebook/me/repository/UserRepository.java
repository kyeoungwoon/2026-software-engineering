package com.example.swebook.me.repository;

import com.example.swebook.me.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
