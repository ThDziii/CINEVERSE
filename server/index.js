const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors()); // Cho phép React gọi API
app.use(express.json());

const PORT = Number(process.env.PORT) || 5000;
const TMDB_KEY = process.env.TMDB_API_KEY;

// Route lấy phim phổ biến
app.get('/api/movies/popular', async (req, res) => {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
            params: {
                api_key: TMDB_KEY,
                language: 'vi-VN',
                page: 1
            }
        });
        res.json(response.data.results);
    } catch (error) {
        console.error("Lỗi gọi TMDB:", error.message);
        res.status(500).json({ error: "Lỗi kết nối server" });
    }
});

// Route tìm kiếm phim
app.get('/api/movies/search', async (req, res) => {
    const { query } = req.query;
    if (!query) return res.json([]);
    try {
        const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
            params: {
                api_key: TMDB_KEY,
                language: 'vi-VN',
                query,
                page: 1,
                include_adult: false,
            }
        });
        res.json(response.data.results);
    } catch (error) {
        console.error("Lỗi tìm kiếm TMDB:", error.message);
        res.status(500).json({ error: "Lỗi kết nối server" });
    }
});

// Route lấy phim theo thể loại
app.get('/api/movies/genre', async (req, res) => {
    const { genre_id } = req.query;
    if (!genre_id) return res.json([]);
    try {
        const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
            params: {
                api_key: TMDB_KEY,
                language: 'vi-VN',
                with_genres: genre_id,
                sort_by: 'popularity.desc',
                page: 1,
            }
        });
        res.json(response.data.results);
    } catch (error) {
        console.error("Lỗi lấy phim theo thể loại:", error.message);
        res.status(500).json({ error: "Lỗi kết nối server" });
    }
});

// Route lấy chi tiết phim (runtime, tagline, ...)
app.get('/api/movies/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
            params: { api_key: TMDB_KEY, language: 'vi-VN' }
        });
        res.json(response.data);
    } catch (error) {
        console.error("Lỗi lấy chi tiết phim:", error.message);
        res.status(500).json({ error: "Lỗi kết nối server" });
    }
});

// Route lấy diễn viên & đoàn làm phim
app.get('/api/movies/:id/credits', async (req, res) => {
    const { id } = req.params;
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/credits`, {
            params: { api_key: TMDB_KEY, language: 'vi-VN' }
        });
        res.json({
            cast: response.data.cast?.slice(0, 12) ?? [],
            crew: response.data.crew ?? [],
        });
    } catch (error) {
        console.error("Lỗi lấy credits:", error.message);
        res.status(500).json({ error: "Lỗi kết nối server" });
    }
});

// Try to listen on the desired port, and if it's already in use (common on macOS
// where system services sometimes occupy low ports), fall back to PORT+1.
const server = app.listen(PORT, () => {
    console.log(`🚀 Server Cineverse đang chạy tại: http://localhost:${PORT}`);
});

server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
        const alt = PORT + 1;
        console.warn(`Port ${PORT} is in use. Trying port ${alt}...`);
        app.listen(alt, () => {
            console.log(`🚀 Server Cineverse đang chạy tại: http://localhost:${alt}`);
        });
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});