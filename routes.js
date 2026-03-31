 
import express from 'express';
import { createContact, getContactRequiredFields, getCompanyRequiredFields, createCompany } from './controller.js';

const router = express.Router();

router.post('/create-contact', createContact);  // Route to create a new contact in HubSpot
router.post('/get-contact-required-fields', getContactRequiredFields); // Route to fetch required HubSpot contact fields
router.post('/create-company', createCompany);  // Route to create a new company record in HubSpot
router.post('/get-company-required-fields', getCompanyRequiredFields); // Route to fetch required HubSpot company fields

export default router;