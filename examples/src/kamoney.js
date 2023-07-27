const axios = require('axios')
const crypto = require('crypto');

module.exports.Kamoney = {
    async publicRequest(path, method, data) {
        let publicEndpoint = `${process.env.API_URL}/v2/public`

        try {
            const req = {
                method,
                url: `${publicEndpoint}${path}`,
                data,
                timeout: 1000 * 60
            }

            const res = await axios(req)
            return res.data
        } catch (e) {
            return {
                success: false,
                msg: e.message
            }
        }
    },
    signQueryMounted(req, comp = '') {
        let reqDataQuery = {};

        for (const [key, value] of Object.entries(req)) {
            if (Array.isArray(value)) {
                reqDataQuery = { ...reqDataQuery, ...this.signQueryMounted(value, `${comp}${key}[${value.indexOf(key)}]`) };
            } else if (typeof value === 'object') {
                reqDataQuery = { ...reqDataQuery, ...this.signQueryMounted(value, `${comp}${key}`) };
            } else {
                reqDataQuery[`${comp}${key}`] = value;
            }
        }

        return reqDataQuery;
    },
    signHmac(req) {
        const reqDataQuery = this.signQueryMounted(req);
        return new URLSearchParams(reqDataQuery).toString();
    },
    async privateRequest(path, method, data) {
        let privateEndpoint = `${process.env.API_URL}/v2/private`

        let mt = process.hrtime();
        data['nonce'] = mt[0] + Math.floor(mt[1] / 1e6);

        // mounted sign
        let data_query = this.signHmac(data);
        let sign = crypto.createHmac('sha512', process.env.SECRET_KEY).update(data_query).digest('hex');

        try {
            const headers = {
                'public': process.env.PUBLIC_KEY,
                'sign': sign,
                'Content-Type': 'application/json',
            }

            let url = `${privateEndpoint}${path}`

            if (method === 'GET') {
                url += `?${data_query}`;
            }

            const req = {
                method,
                url: url,
                headers: headers,
                timeout: 1000 * 60
            }

            if (method === 'POST') {
                req.data = JSON.stringify(data); // convert data to json string
            }

            const res = await axios(req)
            return res.data
        } catch (e) {
            return {
                success: false,
                error: e.message
            }
        }
    },
    async ServicesOrderList() {
        return await this.publicRequest('/services/order', 'GET')
    },
    async AccountGetInfo() {
        return await this.privateRequest(`/account`, 'GET')
    },
    async OrderCreate(asset, network, services) {
        return await this.privateRequest(`/order`, 'POST', { asset, network, ...services })
    }
}