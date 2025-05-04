package com.mahmudalam.jobportal.spring_boot_job_portal_app.interfaces;

import com.mahmudalam.jobportal.spring_boot_job_portal_app.model.JobPostModel;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class SearchRepoImplements implements SearchRepository{

    @Override
    public List<JobPostModel> findByText(String text) {
        final List<JobPostModel> job_post = new ArrayList<>();
        return job_post;
    }
}
