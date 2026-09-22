/**
 * File ini untuk test authentication endpoints
 * Jalankan server dulu dengan: npm start atau npm run dev
 * Lalu jalankan: node testAuth.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/auth';

// Data test user
const testUser = {
    namaLengkap: 'Test User WattWise',
    email: 'testuser@wattwise.com',
    nomorTelepon: '08123456789',
    password: 'test123456',
    konfirmasiPassword: 'test123456'
};

let authToken = '';

// Test Register
async function testRegister() {
    console.log('\n📝 Testing Register...');
    try {
        const response = await axios.post(`${BASE_URL}/register`, testUser);
        console.log('✅ Register Success:', response.data);
        authToken = response.data.data.token;
        return true;
    } catch (error) {
        if (error.response) {
            console.log('❌ Register Error:', error.response.data);
        } else {
            console.log('❌ Error:', error.message);
        }
        return false;
    }
}

// Test Login
async function testLogin() {
    console.log('\n🔐 Testing Login...');
    try {
        const response = await axios.post(`${BASE_URL}/login`, {
            email: testUser.email,
            password: testUser.password
        });
        console.log('✅ Login Success:', response.data);
        authToken = response.data.data.token;
        return true;
    } catch (error) {
        if (error.response) {
            console.log('❌ Login Error:', error.response.data);
        } else {
            console.log('❌ Error:', error.message);
        }
        return false;
    }
}

// Test Get Profile
async function testGetProfile() {
    console.log('\n👤 Testing Get Profile...');
    try {
        const response = await axios.get(`${BASE_URL}/me`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        console.log('✅ Get Profile Success:', response.data);
        return true;
    } catch (error) {
        if (error.response) {
            console.log('❌ Get Profile Error:', error.response.data);
        } else {
            console.log('❌ Error:', error.message);
        }
        return false;
    }
}

// Test Invalid Login
async function testInvalidLogin() {
    console.log('\n🚫 Testing Invalid Login...');
    try {
        const response = await axios.post(`${BASE_URL}/login`, {
            email: testUser.email,
            password: 'wrongpassword'
        });
        console.log('❌ Should have failed but got:', response.data);
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log('✅ Invalid Login correctly rejected:', error.response.data);
        } else {
            console.log('❌ Unexpected Error:', error.response ? error.response.data : error.message);
        }
    }
}

// Run all tests
async function runTests() {
    console.log('🚀 Starting Authentication Tests...');
    console.log('📍 API Base URL:', BASE_URL);
    console.log('⏱️  Make sure the server is running on port 5000!\n');

    // Test Register (akan error jika user sudah ada)
    await testRegister();

    // Test Login
    await testLogin();

    // Test Get Profile (butuh token dari login)
    if (authToken) {
        await testGetProfile();
    }

    // Test Invalid Login
    await testInvalidLogin();

    console.log('\n✨ All tests completed!\n');
}

// Check if axios is installed
try {
    require.resolve('axios');
    runTests();
} catch (e) {
    console.log('❌ axios belum terinstall!');
    console.log('📦 Jalankan: npm install axios');
    console.log('📝 Lalu jalankan: node testAuth.js');
}
