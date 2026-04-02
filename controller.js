import axios from 'axios';


// Controller to fetch required HubSpot contact field

export const getContactRequiredFields = async (req, res) => {
    try {
        const allData = req.body || {};
        const accessToken = (allData.access_token || '').trim();
        if (!accessToken) {
            return res.json({
                status: false,
                message: 'Access token missing'
            });
        }

        // Verify that the access token is valid by calling HubSpot API 
        try {
            await axios.get('https://api.hubapi.com/integrations/v1/me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                timeout: 10000
            });
        } catch (err) {
            return res.json({
                status: false,
                message: 'Invalid or expired access token'
            });
        }
        let data;

        // Fetch contact property fields from HubSpot API
        try {
            const response = await axios.get(
                'https://api.hubapi.com/crm/v3/properties/contacts',
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                }
            );
            data = response.data;
        } catch (err) {
            return res.json({
                status: false,
                message: 'Failed to fetch fields'
            });
        }
        return res.json({
            status: true,
            message: 'Fields fetched successfully',
            data
        });
    } catch (error) {
        return res.json({
            status: false,
            message: `Server error: ${error.message}`
        });
    }
};

// Controller to create new Contact Record in HubSpot

export const createContact = async (req, res) => {
    try {
        const body = req.body || {};

        // Extract access token from request data
        const accessToken = body.access_token?.trim();

        if (!accessToken) {
            return res.json({
                status: false,
                message: 'Access token is missing.'
            });
        }

        const webUrl = 'https://api.hubapi.com/crm/v3/objects/contacts';

        // Construct properties object to send to HubSpot API
        const { access_token, ...rest } = body;

        const properties = Object.fromEntries(
            Object.entries(rest).filter(([key, value]) => value !== undefined && value !== null && value !== '')
        );
        const { data, status } = await axios.post(
            webUrl,
            { properties },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        return res.json({
            status: true,
            message: 'Contact created successfully in HubSpot!',
            api_response: data
        });

    } catch (error) {
        return res.json({
            status: false,
            message: error?.response
                ? 'HubSpot API returned an error'
                : `Request Error: ${error.message}`,
            http_code: error?.response?.status || null,
            api_response: error?.response?.data || null
        });
    }
};



// Controller to fetch required HubSpot Company field

export const getCompanyRequiredFields = async (req, res) => {
    try {
        const allData = req.body || {};
        const accessToken = (allData.access_token || '').trim();
        if (!accessToken) {
            return res.json({
                status: false,
                message: 'Access token missing'
            });
        }

        // Verify that the access token is valid by calling HubSpot API 
        try {
            await axios.get('https://api.hubapi.com/integrations/v1/me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                timeout: 10000
            });
        } catch (err) {
            return res.json({
                status: false,
                message: 'Invalid or expired access token'
            });
        }
        let data;

        // Fetch company property fields from HubSpot API
        try {
            const response = await axios.get(
                'https://api.hubapi.com/crm/v3/properties/companies',
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                }
            );
            data = response.data;
        } catch (err) {
            return res.json({
                status: false,
                message: 'Failed to fetch fields'
            });
        }
        // Define a list of common HubSpot company fields
        // const commonCompanyFields = [
        //     'name', 'domain','phone','industry','address','city','state','zip',           
        //     'country','website','type','lifecyclestage','numberofemployees',
        //     'annualrevenue'   
        // ];

        // const fields = [];

        // // Include only the common fields from HubSpot response
        // if (data?.results?.length) {
        //     const apiFields = {};
        //     data.results.forEach(prop => {
        //         apiFields[prop.name] = prop;
        //     });
        //     commonCompanyFields.forEach(fieldName => {
        //         if (apiFields[fieldName]) {
        //             const prop = apiFields[fieldName];
        //             fields.push({
        //                 name: prop.name,
        //                 label: prop.label || prop.name,
        //                 type: prop.type,
        //                 fieldType: prop.fieldType,
        //                 required: prop.required || false,
        //                 options: prop.options || []
        //             });
        //         }
        //     });
        // }
        return res.json({
            status: true,
            message: 'Fields fetched successfully',
            data
        });
    } catch (error) {
        return res.json({
            status: false,
            message: `Server error: ${error.message}`
        });
    }
};


// Controller to create new Company Record in HubSpot

export const createCompany = async (req, res) => {
    try {
        const body = req.body || {};

        // Extract access token from request data
        const accessToken = body.access_token?.trim();

        if (!accessToken) {
            return res.json({
                status: false,
                message: 'Access token is missing.'
            });
        }

        const webUrl = 'https://api.hubapi.com/crm/v3/objects/companies';

        // Construct properties object to send to HubSpot API
        const { access_token, ...rest } = body;

        const properties = Object.fromEntries(
            Object.entries(rest).filter(([key, value]) => value !== undefined && value !== null && value !== '')
        );

        const { data, status } = await axios.post(
            webUrl,
            { properties },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        return res.json({
            status: true,
            message: 'Company Record created successfully in HubSpot!',
            api_response: data
        });

    } catch (error) {
        return res.json({
            status: false,
            message: error?.response
                ? 'HubSpot API returned an error'
                : `Request Error: ${error.message}`,
            http_code: error?.response?.status || null,
            api_response: error?.response?.data || null
        });
    }
};