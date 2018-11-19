function loadTpl (template) {
    return new Promise(function(resolve, reject) {
        $.get(template, function(returnedTpl) {
            resolve(returnedTpl);
        });
    });
}

var hasSlider;

function hasSlider() {
    if ($(window).width() > 1199) {
        hasSlider = true;
    } else {
        hasSlider = false;
    }
}
hasSlider();

function getItems() {
    return new Promise(function (resolve, reject) {
        var itemsSlider;
        $.ajax({
            type: "Get",
            url: "images.json",
            dataType: "json",
            success: function (data) {
                itemsSlider = data;
                resolve(itemsSlider)
            }
        });
    })
}

function itemsCarousel() {
    return new Promise(function (resolve, reject) {
        getItems().then(function (itemsSlider) {
            loadTpl('templates/slider-item.html').then(function (items) {
                loadTpl('templates/banner.html').then(function (bannerItems) {
                    var tpl = $(items);
                    var smallBanner = $(bannerItems);
                    var box = document.querySelector('.carousel-images');
                    var count = 0;

                    var imgTpl = $('.sliderItem', tpl);
                    if(hasSlider == true) {
                        imgTpl.addClass('hidden');
                    }

                    $.each(itemsSlider, function (index, itemSlider) {
                        var imageWrap = imgTpl.clone();
                        $('.content', tpl).append(imageWrap);

                        if(itemSlider.type ==  'image') {
                            count ++;
                            $('.item', imageWrap).attr('src', itemSlider.url).attr('alt', itemSlider.title).attr('data-id', itemSlider.id);
                            $('.sliderItem_num', imageWrap).html(itemSlider.id);
                            $('.sliderItem_description-text', imageWrap).html(itemSlider.description);
                            $('.sliderItem_description-author', imageWrap).html(itemSlider.author);
                            $('.sliderItem_description-media', imageWrap).html(itemSlider.media);
                            $('.sliderItem_total', tpl).html(itemsSlider.length);
                        } else {
                            if ($(window).width() > 1199) {
                                imageWrap.remove();
                            } else {
                                $('.sliderItem_img', imageWrap).remove();
                                $('.sliderItem_count', imageWrap).remove();
                                $('.sliderItem_description', imageWrap).remove();
                                imageWrap.append(smallBanner);
                                $('.banner-img', smallBanner).attr('src', itemSlider.url).attr('alt', itemSlider.title);
                            }
                        }

                    });

                    $(tpl).find('.sliderItem_total').html(count);
                    $(tpl).find('.sliderItem').first().remove();
                    $(tpl).find('.sliderItem').first().addClass('current');
                    $(tpl).appendTo(box);
                    resolve();
                })
            })
        })
    })
}


function carousel() {
    var box = document.querySelector('.carousel-images');
    var items = box.querySelectorAll('.sliderItem');
    var counter = 0;
    var amount = items.length;
    var current = items[0];

    box.classList.add('active');

    function navigate(direction) {
        current.classList.remove('current');
        counter = counter + direction;
        if (direction === -1 &&
            counter < 0) {
            counter = amount - 1;
        }
        if (direction === 1 &&
            !items[counter]) {
            counter = 0;
        }
        current = items[counter];
        current.classList.add('current');
        current.classList.add('sliderItem_img--effect');
    }

    $('.arrow-next').on('click', function(ev) {
        navigate(1);
    });
    $('.arrow-prev').on('click', function(ev) {
        navigate(-1);
    });
    navigate(0);
}


itemsCarousel()
    .then(function () {
        if(hasSlider == true) {
            carousel()
        }
    });

function itemBanner() {
    return new Promise(function (resolve, reject) {
        loadTpl('templates/banner.html').then(function (item) {
            var tpl = $(item);
            var box = document.querySelector('.carousel-banner');

            $('.banner-img', tpl).attr('src', './images/banner.jpg').css({width: '300px', height: '600px'});
            $(tpl).appendTo(box);

            resolve();
        })
    })
}

itemBanner();


function itemsGalery() {
    return new Promise(function (resolve, reject) {
        getItems().then(function (itemsSlider) {
            loadTpl('templates/gallery-first-row.html').then(function (firstItems) {
                loadTpl('templates/gallery-second-row.html').then(function (secondItems) {
                    var ftpl = $(firstItems);
                    var stpl = $(secondItems);
                    var box = document.querySelector('.gallery-container');
                    var count = 1;

                    var fimgTpl = $('.gallery-item', ftpl);
                    var simgTpl = $('.gallery-item_big', stpl);


                    $.each(itemsSlider, function (index, itemSlider) {
                        if(count % 5 == 0) {
                            var simageWrap = simgTpl.clone();
                            $('.gallery-container').append(simageWrap);
                            $('.item', simageWrap).attr('src', itemSlider.url).attr('alt', itemSlider.title).attr('data-id', itemSlider.id);
                            $('.gallery-item_desc-title', simageWrap).html(itemSlider.title);
                        } else {
                            var fimageWrap = fimgTpl.clone();
                            $('.gallery-container').append(fimageWrap);
                            $('.item', fimageWrap).attr('src', itemSlider.url).attr('alt', itemSlider.title).attr('data-id', itemSlider.id);
                            $('.gallery-item_desc-title', fimageWrap).html(itemSlider.title);
                        }
                        count++;
                    })

                    $(ftpl).find('.gallery-item').first().remove();
                    $(stpl).find('.gallery-item').first().remove();
                    $(ftpl).appendTo(box);
                    resolve();
                })
            })
        })
    })
}

itemsGalery();