package org.monarchinitiative.phenopacketlab.restapi.controller;

import org.monarchinitiative.phenopacketlab.core.miner.TextMiningOptions;
import org.monarchinitiative.phenopacketlab.core.miner.TextMiningService;
import org.monarchinitiative.phenopacketlab.core.model.MinedText;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping(value = "${api.version}/textminer", method = RequestMethod.POST)
public class TextMiningController {

    private final TextMiningService textMiningService;

    public TextMiningController(TextMiningService textMiningService) {
        this.textMiningService = textMiningService;
    }

    @PostMapping
    public ResponseEntity<MinedText> minedText(@RequestBody String payload) {
        if (payload == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        TextMiningOptions options = TextMiningOptions.builder()
                .doFuzzyMatching(true) // TODO we could add isExactMatch as a parameter to the endpoint
                .build();
        MinedText result = textMiningService.mineText(payload, options);

        return ResponseEntity.ok(result);
    }

}
