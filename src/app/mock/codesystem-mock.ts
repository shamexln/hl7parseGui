import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CodesystemMockService {
  // Mock data for codesystem
  private mockCodesystemData = [
    {
      id: 1,
      code: "LOINC",
      display: "Logical Observation Identifiers Names and Codes",
      version: "2.73",
      description: "LOINC database provides a set of universal names and ID codes for identifying laboratory and clinical test results."
    },
    {
      id: 2,
      code: "SNOMED-CT",
      display: "SNOMED Clinical Terms",
      version: "International 2023-07-31",
      description: "SNOMED CT is a systematically organized computer processable collection of medical terms providing codes, terms, synonyms and definitions used in clinical documentation and reporting."
    },
    {
      id: 3,
      code: "ICD-10",
      display: "International Classification of Diseases, 10th Revision",
      version: "2023",
      description: "The ICD-10 is the 10th revision of the International Statistical Classification of Diseases and Related Health Problems, a medical classification list by the World Health Organization."
    },
    {
      id: 4,
      code: "RxNorm",
      display: "RxNorm",
      version: "202308",
      description: "RxNorm provides normalized names for clinical drugs and links its names to many of the drug vocabularies commonly used in pharmacy management and drug interaction software."
    },
    {
      id: 5,
      code: "CPT",
      display: "Current Procedural Terminology",
      version: "2023",
      description: "The Current Procedural Terminology (CPT) code set is a medical code set maintained by the American Medical Association."
    }
  ];

  /**
   * Get mock codesystem data
   * @returns Observable of mock codesystem data
   */
  getCodesystem(): Observable<any[]> {
    return of(this.mockCodesystemData);
  }
}
