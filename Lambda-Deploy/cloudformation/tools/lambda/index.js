const axios = require('axios');

exports.handler = async (event) => {
    try {
        const response = await axios.get('https://api.github.com');
        return {
            statusCode: 200,
            body: JSON.stringify(response.data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error.message),
        };
    }
};
