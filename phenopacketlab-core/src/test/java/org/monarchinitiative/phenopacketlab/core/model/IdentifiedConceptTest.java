package org.monarchinitiative.phenopacketlab.core.model;

import org.junit.jupiter.api.Test;
import org.monarchinitiative.phenol.ontology.data.TermId;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;

public class IdentifiedConceptTest extends BaseSerializationTest {



    @Test
    public void testSerialization_fullExample() throws Exception {
        IdentifiedConcept concept = IdentifiedConcept.of(
                TermId.of("HP:0001166"), "Arachnodactyly",
                "Abnormally long and slender fingers (\"spider fingers\").",
                List.of("Long slender fingers", "Spider fingers"));

        String actual = OBJECT_MAPPER.writeValueAsString(concept);
        assertThat(actual, equalTo("""
                {
                  "id" : "HP:0001166",
                  "lbl" : "Arachnodactyly",
                  "def" : "Abnormally long and slender fingers (\\"spider fingers\\").",
                  "syn" : [ "Long slender fingers", "Spider fingers" ]
                }"""));
    }

    @Test
    public void testSerialization_missingFields() throws Exception {
        IdentifiedConcept concept = IdentifiedConcept.of(
                TermId.of("HP:1234567"), "Jimmy",
                null,
                List.of());

        String actual = OBJECT_MAPPER.writeValueAsString(concept);
        assertThat(actual, equalTo("""
                {
                  "id" : "HP:1234567",
                  "lbl" : "Jimmy",
                  "def" : null,
                  "syn" : [ ]
                }"""));
    }
}
