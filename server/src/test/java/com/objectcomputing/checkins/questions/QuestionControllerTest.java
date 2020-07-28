package com.objectcomputing.checkins.questions;

import com.objectcomputing.checkins.services.questions.Question;
import com.objectcomputing.checkins.services.questions.QuestionController;
import com.objectcomputing.checkins.services.questions.QuestionServices;
import com.objectcomputing.checkins.services.skills.SkillControllerTest;
import io.micronaut.http.client.exceptions.HttpClientResponseException;
import io.micronaut.test.annotation.MicronautTest;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.client.HttpClient;
import io.micronaut.http.client.annotation.Client;
import io.micronaut.http.client.exceptions.HttpClientResponseException;
import io.micronaut.test.annotation.MicronautTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import javax.inject.Inject;

import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.*;
import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@MicronautTest
public class QuestionControllerTest {

    private static final Logger LOG = LoggerFactory.getLogger(SkillControllerTest.class);

    @Inject
    @Client("/questions")
    private HttpClient client;

    @Inject
    QuestionController itemUnderTest;

    QuestionServices mockQuestionServices = mock(QuestionServices.class);
    Question mockQuestion = mock(Question.class);

    String fakeUuid = "12345678-9123-4567-abcd-123456789abc";

    @BeforeEach
    void setup() {
        itemUnderTest.setQuestionService(mockQuestionServices);
        reset(mockQuestionServices);
        reset(mockQuestion);
    }


    @Test
    public void testGETNonExistingEndpointReturns404() {
        HttpClientResponseException thrown = assertThrows(HttpClientResponseException.class, () -> {
            client.toBlocking().exchange(HttpRequest.GET("/12345678-9123-4567-abcd-123456789abc"));
        });

        assertNotNull(thrown.getResponse());
        assertEquals(HttpStatus.NOT_FOUND, thrown.getStatus());
    }


    @Test
    public void testPOSTCreateAQuestion() {

        Question fakeQuestion = new Question("fake question");

        when(mockQuestionServices.saveQuestion(fakeQuestion)).thenReturn(fakeQuestion);

        final HttpResponse<?> response = client.toBlocking()
                .exchange(HttpRequest.POST("/", fakeQuestion));

        assertEquals(HttpStatus.CREATED, response.getStatus());
        assertNotNull(response.getContentLength());
    }
}