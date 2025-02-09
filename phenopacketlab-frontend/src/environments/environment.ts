// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const URL = 'http://localhost:8080';
const API_URL = `${URL}/api`;

export const environment = {
  production: false,
  API_DOC: `${URL}/swagger-ui/index.html`,
  MESSAGE_URL: `${API_URL}/message`,
  PHENOTYPIC_FEATURE_URL: `${API_URL}/phenotypic-features`,
  PHENOTYPIC_FEATURE_SEARCH_URL: `${API_URL}/phenotypic-features/search`,
  DISEASE_URL: `${API_URL}/diseases`,
  DISEASE_SEARCH_URL: `${API_URL}/diseases/search`,
  BODY_SITE_URL: `${API_URL}/constants/tree-body-site`,
  UNIT_URL: `${API_URL}/constants/tree-unit`,
  PHENO_VALIDATE_URL: `${API_URL}/validate`,
  SEX_URL: `${API_URL}/constants/sex`,
  GENDER_URL: `${API_URL}/constants/gender`,
  SEVERITY_URL: `${API_URL}/constants/severity`,
  LATERALITY_URL: `${API_URL}/constants/laterality`,
  MODIFIERS_URL: `${API_URL}/constants/treemodifier`,
  EVIDENCES_URL: `${API_URL}/constants/evidence`,
  MONDO_DISEASES_URL: `${API_URL}/mondo-diseases`,
  ONSETS_URL: `${API_URL}/constants/treeonset`,
  TNM_TUMOR_URL: `${API_URL}/constants/tree-tnm-tumor`,
  TNM_NODE_URL: `${API_URL}/constants/tree-tnm-node`,
  TNM_METASTASIS_URL: `${API_URL}/constants/tree-tnm-metastasis`,
  DISEASE_STAGES_URL: `${API_URL}/constants/tree-disease-stages`,
  TEXT_MINING_URL: `${API_URL}/textminer`,
  FUNCTIONAL_ANNOTATION_URL: `${API_URL}/functional-annotation`,
  ALLELIC_STATE_SHORT_URL: `${API_URL}/constants/allelic-states`,
  ALLELIC_STATE_URL: `${API_URL}/constants/tree-allelic-states`,
  STRUCTURAL_TYPE_URL: `${API_URL}/constants/tree-structural`,
  ROUTE_OF_ADMINISTRATION_URL: `${API_URL}/constants/tree-route-administration`,
  SCHEDULE_FREQUENCY_URL: `${API_URL}/constants/tree-schedule-frequency`,
  ADVERSE_EVENT_URL: `${API_URL}/constants/tree-adverse-event`,
  TREATMENT_STATUS: `${API_URL}/constants/tree-treatment-status`,
  TREATMENT_INTENT_URL: `${API_URL}/constants/treatment-intent`,
  NCIT_PROCEDURE_URL: `${API_URL}/constants/tree-ncit-procedure`,
  RADIATION_THERAPY_URL: `${API_URL}/constants/tree-radiation-therapy`,
  TREATMENT_REGIMEN_URL: `${API_URL}/constants/tree-treatment-regimen`,
  DISEASE_RESPONSE_URL: `${API_URL}/constants/tree-disease-response`,
  HOMO_SAPIENS_URL: `${API_URL}/constants/homosapiens`,
  CHEMICAL_ENTITY_URL: `${API_URL}/chemical-entities`,
  CHEMICAL_ENTITY_SEARCH_URL: `${API_URL}/chemical-entities/search`,
  METADATA_URL: `${API_URL}/metadata`,
  RESOURCE_URL: `${API_URL}/resource`,
  USER_URL: `${API_URL}/user`,
  PHENOPACKET_URL: `${API_URL}/phenopacket`,
  DOCS_URL: `https://thejacksonlaboratory.github.io/PhenopacketLab/dev/`,
  AUTH: {
    domain: 'thejacksonlaboratory.auth0.com',
    clientId: 'oEZ1oN01Ts2wuW3MzTSxq3h6PcnN10Y5',
    authorizationParams: {
      redirect_uri: window.location.origin
    },
    httpInterceptor: {
      allowedList: [
        {
          uri: `${API_URL}/user`,
          tokenOptions: {
            authorizationParams: {
              audience: `https://phenopacketlab.jax.org`
            }
          }
        },
        {
          uri: `${API_URL}/phenopacket`,
          tokenOptions: {
            authorizationParams: {
              audience: `https://phenopacketlab.jax.org`
            }
          }
        }
      ]
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
