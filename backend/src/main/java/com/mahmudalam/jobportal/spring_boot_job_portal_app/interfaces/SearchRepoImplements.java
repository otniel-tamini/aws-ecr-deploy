package com.mahmudalam.jobportal.spring_boot_job_portal_app.interfaces;

import com.mahmudalam.jobportal.spring_boot_job_portal_app.model.JobPostModel;
import com.mongodb.client.AggregateIterable;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.convert.MongoConverter;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class SearchRepoImplements implements SearchRepository{

    @Autowired
    MongoClient client;

    @Autowired
    MongoConverter converter;

    @Override
    public List<JobPostModel> findByText(String text) {
        final List<JobPostModel> job_post = new ArrayList<>();

        MongoDatabase database = client.getDatabase("job_portal_db");
        MongoCollection<Document> collection = database.getCollection("job_posts");
        AggregateIterable<Document> result = collection.aggregate(Arrays.asList(
                new Document("$search",
                        new Document("text",
                                new Document("query", text).append("path", Arrays.asList("profile", "techs", "desc")))),
                new Document("$sort",
                        new Document("exp", -1L)),
                new Document("$limit", 5L)));

        result.forEach(doc -> job_post.add(converter.read(JobPostModel.class,doc)));

        return job_post;
    }
}
