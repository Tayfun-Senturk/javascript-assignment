(() => {
    const init = async () => {
        let products = JSON.parse(localStorage.getItem('products'));

        if (!products) {
            const response = await fetch("https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json");
            products = await response.json();
            localStorage.setItem('products', JSON.stringify(products));
        }

        buildHTML(products);
        buildCSS();
        setEvents(products);
    };

    const buildHTML = (products) => {
        const carouselHTML = `
            <div class="custom-carousel">
                <h2>You Might Also Like</h2>
                <button class="carousel-btn left-btn">&lt;</button>
                <div class="carousel-wrapper">
                    <div class="carousel-track">
                        ${products.map((product, index) => `
                            <div class="carousel-item" data-index="${index}">
                                <a href="${product.url}" target="_blank">
                                    <img src="${product.img}" alt="${product.name}">
                                </a>
                                <h3>${product.name}</h3>
                                <p>${product.price} TL</p>
                                <button class="heart-btn ${isFavorite(product.id) ? 'favorited' : ''}" data-id="${product.id}">❤</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <button class="carousel-btn right-btn">&gt;</button>
            </div>
        `;
        $('.product-detail').append(carouselHTML);
    };

    const buildCSS = () => {
        const css = `
            .custom-carousel {
                margin: 40px auto;
                font-family: Arial, sans-serif;
                width: 85%;
                position: relative;
            }
            .custom-carousel h2 {
                font-size: 20px;
                margin-left: 10px;
                margin-bottom: 15px;
            }
            .carousel-wrapper {
                overflow: hidden;
                position: relative;
                width: 100%;
            }
            .carousel-track {
                display: flex;
                transition: transform 0.5s ease-in-out;
                will-change: transform;
            }
            .carousel-item {
                flex: 0 0 calc(100% / 6);
                box-sizing: border-box;
                padding: 10px;
                text-align: center;
            }
            .carousel-item img {
                width: 100%;
                height: auto;
                border: 1px solid #ddd;
                border-radius: 5px;
            }
            .carousel-item h3 {
                font-size: 16px;
                margin: 10px 0 5px;
            }
            .carousel-item p {
                font-size: 14px;
                color: #888;
            }
            .heart-btn {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #888;
            }
            .heart-btn.favorited {
                color: blue;
            }
            .carousel-btn {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                cursor: pointer;
                font-size: 30px;
                z-index: 10;
            }
            .carousel-btn:hover {
                color: #000;
            }
            .left-btn {
                left: -40px;
            }
            .right-btn {
                right: -40px;
            }
            @media (max-width: 1024px) {
                .carousel-item {
                    flex: 0 0 calc(100% / 4);
                }
                .left-btn {
                    left: -30px;
                }
                .right-btn {
                    right: -30px;
                }
            }
            @media (max-width: 768px) {
                .carousel-item {
                    flex: 0 0 calc(100% / 3);
                }
                .left-btn {
                    left: -20px;
                }
                .right-btn {
                    right: -20px;
                }
            }
            @media (max-width: 480px) {
                .carousel-item {
                    flex: 0 0 calc(100%);
                }
                .custom-carousel h2 {
                    font-size: 18px;
                }
                .carousel-btn {
                    font-size: 24px;
                }
            }
        `;
        $('<style>').addClass('carousel-style').html(css).appendTo('head');
    };

    const setEvents = (products) => {
        const track = $('.carousel-track');
        let currentSlide = 0;

        $('.right-btn').on('click', () => {
            if (currentSlide < products.length - 6) {
                currentSlide++;
                updateCarousel(track, currentSlide);
            }
        });

        $('.left-btn').on('click', () => {
            if (currentSlide > 0) {
                currentSlide--;
                updateCarousel(track, currentSlide);
            }
        });

        $('.heart-btn').on('click', function () {
            const productId = $(this).data('id');
            toggleFavorite(productId);
            $(this).toggleClass('favorited');
        });
    };

    const updateCarousel = (track, currentSlide) => {
        const itemWidth = $('.carousel-item').outerWidth(true);
        const newPosition = -currentSlide * itemWidth;
        track.css('transform', `translateX(${newPosition}px)`);
    };

    const isFavorite = (id) => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        return favorites.includes(id);
    };

    const toggleFavorite = (id) => {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (favorites.includes(id)) {
            favorites = favorites.filter(favId => favId !== id);
        } else {
            favorites.push(id);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
    };

    init();
})();
