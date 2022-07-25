const Films = require('../models/film.models');

const slugify = require('slugify');

function handeDataPost(req, res, next) {
    req.body.is_cinema = !!parseInt(req.body.is_cinema);
    req.body.is_film_hot = !!parseInt(req.body.is_film_hot);
    req.body.is_film_canonical = !!parseInt(req.body.is_film_canonical);
    req.body.tags = req.body.tags.split(',').reduce((arrTags, currentTag) => {
        arrTags.push(currentTag.toLowerCase());
        return arrTags;
    }, []);
    req.body.tagsascii = req.body.tags.reduce((arrTagsAscii, currentTag) => {
        arrTagsAscii.push(slugify(currentTag, {
            lower: true,
            locale: 'vi',
            remove: /[*+~.()'"!:@]/g,
        }));
        return arrTagsAscii;
    }, []);
    
    next();
}
function createFilm(req, res, next) {
    const films = new Films({
        film_name: req.body.name,
        film_originalname: req.body.original_name,
        film_status: req.body.status,
        film_img: req.body.image,
        film_imgbn: req.body.image_banner,
        film_imgbn_canonical: req.body.image_canonical,
        film_category: req.body.categories,
        film_country: req.body.countries,
        // film_episodes: ,
        film_trailer: req.body.trailer,
        film_duration: req.body.duration,
        film_quality: req.body.quality,
        film_year: req.body.year,
        film_imdb: req.body.imdb,
        film_language: req.body.language,
        film_cinema: req.body.is_cinema,
        film_hot: req.body.is_film_hot,
        film_canonical: req.body.is_film_canonical,
        film_type: req.body.type_film,
        film_message: req.body.message_film,
        film_description: req.body.description_film,
        film_info: req.body.info_film,
        // film_imginfo: ,
        film_tag: req.body.tags,
        film_tagascii: req.body.tagsascii,
        // film_slug: req.body.slug,
        film_uploadby: req.body.user_id,
    });
    films.save()
        .then(() => {
            console.log('Create new film done!'); 
            next();
        })
        .catch(next);
}
module.exports = {
    handeDataPost,
    createFilm,
};