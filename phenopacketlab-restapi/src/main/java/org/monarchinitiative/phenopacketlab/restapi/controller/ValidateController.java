package org.monarchinitiative.phenopacketlab.restapi.controller;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.monarchinitiative.phenopacketlab.core.ValidateService;
import org.phenopackets.phenopackettools.validator.core.ValidationResults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "${api.version}/validate", method = RequestMethod.POST)
public class ValidateController {

    private final ValidateService validateService;

    public ValidateController(ValidateService validateService) {
        this.validateService = validateService;
    }

    @ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Get validation results given a phenopacket string") })
    @PostMapping
    public ResponseEntity<ValidationResults> validatePhenopacket(@RequestBody String phenopacketString) {
        if (phenopacketString == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        return ResponseEntity.ok(validateService.validate(phenopacketString));
    }
}
