
const toolTipContainer = document.querySelector('.tooltip-btn-container');

let toolTip = {
    visible: false,
    interval: null,
    counter: 4,
    show: function(){
        this.visible = true;
        this.interval = setInterval(()=>{
            if (this.counter <= 0){                
                clearInterval(this.interval);
                this.counter = 4;
                this.visible = false;
                toolTipContainer.classList.remove('show');
            } else{
                this.counter--;
                //console.log(this.counter);
            }
            
        }, 1000)
    },
    restart: function(){
        this.counter = 4
    },

    hide: function(){
        clearInterval(this.interval);
        this.counter = 4;
        this.visible = false;

        if ( toolTipContainer ) {
            toolTipContainer.classList.remove('show');
        }
        
    }
}

/**********Класс для работы с аккордионами*****************/ 
class Accordion {
    constructor(accordion_node){
        this.accordion = accordion_node;

        this.items = this.accordion.querySelectorAll('.acc-item');
        this.headers = this.accordion.querySelectorAll('.acc-header');
        
        this.singleMode = false;

        if ( this.accordion.getAttribute('data-mode') === 'single' ){
            this.singleMode = true;
        }
        let self = this;
        
        this.items.forEach( item => {
            if ( item.classList.contains('open') ){

                const itemBody = item.querySelector('.acc-body');
                const height = item.querySelector('.acc-body-inner').offsetHeight;


                anime({
                    targets: itemBody,
                    height: height,
                    duration: 0,                    
                });
            }
        })

        this.headers.forEach( hItem => {
            hItem.addEventListener('click', function(){
                let curParent = this.closest('.acc-item');

                let curBody = this.nextElementSibling;
                let height = curBody.querySelector('.acc-body-inner').offsetHeight;
                

                if ( curParent.classList.contains('open') ){
                    self.rollItem(this, 150);
                } else{

                    if ( self.singleMode ){
                        const openItems =  self.accordion.querySelectorAll('.acc-item.open');
                        
                        openItems.forEach( oi => {

                            const header = oi.querySelector('.acc-header');
                            //console.log(header);
                            self.rollItem(header, 150);
                        } )  
                            
                        
                    }

                    self.deployItem(this, 150);
                }
                

            })
        } );



        
    }

    rollItem( headerNode, speed ){
        let curParent = headerNode.closest('.acc-item');
        let curBody = headerNode.nextElementSibling;

        if (toolTipContainer){
            toolTip.hide();
        }

        anime({
            targets: curBody,
            height: 0,
            duration: speed,
            easing: 'linear',
            begin: function() {
                curParent.classList.remove('open');
            }
        });
    }


    deployItem(headerNode, speed){
        let curParent = headerNode.closest('.acc-item');
        let curBody = headerNode.nextElementSibling;

        let height = curBody.querySelector('.acc-body-inner').offsetHeight;
        if (toolTipContainer){
            toolTip.hide();
        }
        anime({
            targets: curBody,
            height: height,
            duration: speed,
            easing: 'linear',
            begin: function() {
                curParent.classList.add('open');
            }
        });
    }
}

/*Инициализация аккордионов*/
const filtersAccordion = document.querySelector('.filters-acc');
if ( filtersAccordion ){
    let  t  = new Accordion( filtersAccordion );
    
}
const mobileMenuAccordion = document.querySelector('.mobile-menu-accordion');
if ( mobileMenuAccordion ){
    let  t  = new Accordion( mobileMenuAccordion );
    
}

const categoryProductsAccordion = document.querySelector('.category-products-accordion');
if ( categoryProductsAccordion ){
    let  t  = new Accordion( categoryProductsAccordion );
    
}





const headerSearchBtn = document.querySelector('.header__search-btn');
const headerSearchForm = document.querySelector('.header__search-form');

const hamburgerMenuCategory = document.querySelectorAll('.hamburger-menu__category');
const hamburgerMenuGridLinks = document.querySelectorAll('.hamburger-menu__grid-links');

const hamburgerDesktop = document.querySelector('.h-menu__container.desk');
const hamburgerMobile = document.querySelector('.h-menu__container.mob');

const hamburgerMenu = document.querySelector('.hamburger-menu');
const mobHamburgerMenu = document.querySelector('.mob-hamburger-menu');


headerSearchBtn.addEventListener('click', function(){

    hamburgerDesktop.classList.remove('open');
    hamburgerMobile.classList.remove('open');
    hamburgerMenu.classList.remove('open');
    mobHamburgerMenu.classList.remove('open');

    if ( !this.classList.contains('open') ){
        this.classList.add('open');
        headerSearchForm.classList.add('open');
    } else {
        this.classList.remove('open');
        headerSearchForm.classList.remove('open');
    }
    
});



hamburgerMenuCategory.forEach( btn => {
    btn.addEventListener('click', function(){
        if ( !this.classList.contains('active') ){
            let activeBtn = document.querySelector('.hamburger-menu__category.active');
            activeBtn.classList.remove('active');
            let activeList =  document.querySelector('.hamburger-menu__grid-links.active');

            activeList.classList.remove('active');
            let index = this.getAttribute('data-target');

            document.querySelector('.hamburger-menu__grid-links[data-index="' + index+ '"]').classList.add('active');


            this.classList.add('active');
        }
    })
} );  




hamburgerDesktop.addEventListener('click', function(){

    headerSearchBtn.classList.remove('open');
    headerSearchForm.classList.remove('open');



    if ( !this.classList.contains('open') ){
        this.classList.add('open');


        hamburgerMenu.classList.add('open');

    } else{
        this.classList.remove('open');

        hamburgerMenu.classList.remove('open');
    }
});

hamburgerMobile.addEventListener('click', function(){
    const headerBottom = document.querySelector('.header__bottom');
    const bottomMenu = document.querySelector('.bottom-menu');

    headerSearchBtn.classList.remove('open');
    headerSearchForm.classList.remove('open');


    if ( !this.classList.contains('open') ){
        let windowHeight = document.documentElement.clientHeight;
        let maxHeight = windowHeight - ( headerBottom.offsetHeight + bottomMenu.offsetHeight );   
        mobHamburgerMenu.style.maxHeight = maxHeight + 'px';
        mobHamburgerMenu.style.height = maxHeight + 'px';
        

        this.classList.add('open');
        mobHamburgerMenu.classList.add('open');
    } else{
        this.classList.remove('open');
        mobHamburgerMenu.classList.remove('open');
    }

    
})



window.addEventListener('scroll', function(event){
    const header = document.querySelector('.header');
    const headerBottom = document.querySelector('.header__bottom');

    if ( window.pageYOffset > 0){
        let headerHeight = header.offsetHeight;
        let headerBottomHeight = headerBottom.offsetHeight;

        

        let offsetY = headerHeight - headerBottomHeight; 

        if ( offsetY > 0 ){
            offsetY = -1 * ( offsetY - 10 );
        }

        header.style.transform = 'translateY(' + offsetY + 'px)';


    } else{
        header.style.transform = 'translateY(' + 0 + 'px)';
    }


    
})


const addFavoriteBtns = document.querySelectorAll('.product-card__add-favorite');

if ( addFavoriteBtns.length ){
    addFavoriteBtns.forEach( btn => {
        btn.addEventListener('click', function(){
            if ( !this.classList.contains('checked') ){
                this.classList.add('checked');
            } else{
                this.classList.remove('checked');
            }
        })
    } )
}


let slider = new Swiper(".products-slider-1", {
    speed: 1000,
    autoplay: {
        delay: 6000,
    },
    slidesPerView: 1.5,
    spaceBetween: 0,
    
    
    navigation: {
        nextEl: '.product-slider-next-1',
        prevEl: '.product-slider-prev-1',
    },
    breakpoints: {
        
        421: {
            slidesPerView: 2,
            spaceBetween: 0
        },
        500: {
            slidesPerView: 3,
            spaceBetween: 0
        },
        700: {
            slidesPerView: 4,
            spaceBetween: 0
        },
        1000: {
            slidesPerView: 5,
            spaceBetween: 0
        },
        1200: {
            slidesPerView: 6,
            spaceBetween: 0
        }
    }
})

let slider2 = new Swiper(".products-slider-2", {
    speed: 1000,
    autoplay: {
        delay: 7000,
    },
    slidesPerView: 1.5,
    spaceBetween: 0,
    
    
    navigation: {
        nextEl: '.product-slider-next-2',
        prevEl: '.product-slider-prev-2',
    },
    breakpoints: {
        
        421: {
            slidesPerView: 2,
            spaceBetween: 0
        },
        500: {
            slidesPerView: 3,
            spaceBetween: 0
        },
        700: {
            slidesPerView: 4,
            spaceBetween: 0
        },
        1000: {
            slidesPerView: 5,
            spaceBetween: 0
        },
        1200: {
            slidesPerView: 6,
            spaceBetween: 0
        }
    }
})

const aboutBtnShowText = document.querySelector('.about__btn-show-text');

if ( aboutBtnShowText ){
    aboutBtnShowText.addEventListener('click', function(){
        const aboutText = document.querySelectorAll('.about__text');

        if ( this.getAttribute('data-state') === '0'){
            for ( let i = 1; i <  aboutText.length; i++){
                setTimeout(()=>{
                    aboutText[i].classList.add('show');
                }, 100);
                
            }
            this.setAttribute('data-state', 1) ;
            this.innerText = 'Свернуть'
        } else{
            for ( let i = aboutText.length - 1; i > 0; i--){
                setTimeout(()=>{
                    aboutText[i].classList.remove('show');
                }, 100);
                
            }
            this.setAttribute('data-state', 0) ;
            this.innerText = 'Развернуть'
        }

        
    });
}


let newsSlider = new Swiper(".news-swiper", {
    speed: 1000,
    autoplay: {
        delay: 6000,
    },
    slidesPerView: 1.1,
    spaceBetween: 6,
    loop: true,
   
    breakpoints: {
        
        500: {
            slidesPerView: 2.2,
            spaceBetween: 10
        },
        
    }
})


let sliderReviews = new Swiper(".reviews-swiper", {
    speed: 1000,
    
    slidesPerView: 1.1,
    spaceBetween: 6,
    
    breakpoints: {
        581: {
            slidesPerView: 1.25,
            spaceBetween: 10
        },
        1024: {
            slidesPerView: 2,
            spaceBetween: 20
        }
    }
})



//const filtersList 

const productsLenghtBtns = document.querySelectorAll('.card-on-page__count');
const filtersListForm = document.querySelector('.filters-list');
const sorterLinks = document.querySelectorAll('.sorter__link');

/*Выпадающий список с фильтрами + его настройки*/

selectOptions = {
    maxHeight: 500,
    
    openIcon: '<div class="open-triangle"></div>',
    placeholder: 'Сортировать по:',
    onChange: function(value){
        const sortByField = filtersListForm.querySelector('input[name="order_by"]');
        sortByField.value = value;
        filtersListForm.submit();        
    }
}



const select = document.querySelector('#first-select');
if ( select ){
    const firstSelect = new easySelect('#first-select', selectOptions);
}



if ( sorterLinks.length ){
    sorterLinks.forEach( link => {
        link.addEventListener('click', function(event){
            event.preventDefault();            
            if ( !this.classList.contains('active') ){
                const sortByField = filtersListForm.querySelector('input[name="order_by"]');
                sortByField.value = link.getAttribute('data-order');
                filtersListForm.submit();
            }
        })
    } )
}


if ( productsLenghtBtns.length ){
    productsLenghtBtns.forEach( btn => {
       
        btn.addEventListener('click', function(event){
            event.preventDefault();            
            if ( !this.classList.contains('active') ){
                const lenghtField = filtersListForm.querySelector('input[name="length"]');
                lenghtField.value = btn.innerHTML;
                filtersListForm.submit();
            }
        })
    } )
}


/*-------Настрока работы range-слайдера ----------*/

const rangeSlider = document.getElementById('range-slider');


if ( rangeSlider ){
  
    const minRange = document.querySelector('.min-range');   
    const maxRange = document.querySelector('.max-range');  
    
    const minValue = Number( minRange.getAttribute('min') );
    const maxValue = Number( maxRange.getAttribute('max') );
    const stepRange = Number( maxRange.getAttribute('data-step') );

    
    const tooltipCaller = document.querySelectorAll('[data-tooltip]');
    const filtersList = document.querySelector('.filters-list');

    





    
    function calcTooltipPosition(container, targetContainer){
        const parentPos = container.getBoundingClientRect();
        const childPos = targetContainer.getBoundingClientRect();
        const relativePos = {};
        relativePos.top = childPos.top - (parentPos.top - ( targetContainer.offsetHeight / 2) );
        toolTipContainer.style.top = relativePos.top + 'px';

    }

    tooltipCaller.forEach( caller => {
        caller.addEventListener('change', function(){
            const targetContainer = this.closest('.tooltip-target');
            
            if ( toolTip.visible === false){

                calcTooltipPosition(filtersList, targetContainer);
                toolTipContainer.classList.add('show');
                toolTip.show();
                
            } else{
                calcTooltipPosition(filtersList, targetContainer);
                toolTip.restart();
            }
        })
        caller.addEventListener('input', function(){
            const targetContainer = this.closest('.tooltip-target');
            
            if ( toolTip.visible === false){

                calcTooltipPosition(filtersList, targetContainer);
                toolTipContainer.classList.add('show');
                toolTip.show();
                
            } else{
                calcTooltipPosition(filtersList, targetContainer);
                toolTip.restart();
            }
        })
        
    } )  



  noUiSlider.create(rangeSlider, {
      start: [minRange.value, maxRange.value],
      connect: true,
      range: {
          'min': minValue,
          'max': maxValue
      },
      step: stepRange,
  
      
  });


  minRange.addEventListener('input', function(){
    let numMin = Number( this.value );
    let numMax = Number( maxRange.value );
    if (numMin > numMax) {
      numMin = numMax

      this.value = numMin;
    }
    rangeSlider.noUiSlider.set([numMin, null])
    //createRangeTag([numMin, numMax]);
  })

  minRange.addEventListener('blur', function(){
    
    if (this.value.length === 0){
      this.value = 0;
    }

    
  })

  maxRange.addEventListener('input', function(){
    let numMin = Number( minRange.value );
    let numMax = Number( this.value );
    if (numMax < numMin) {
      numMax = numMin

      
    }
    rangeSlider.noUiSlider.set([null, numMax])
    //createRangeTag([numMin, numMax]);
  })

  maxRange.addEventListener('blur', function(){
    
    if (this.value.length === 0){
      this.value = maxValue;
      rangeSlider.noUiSlider.set([null, maxValue])
    }
  })

  rangeSlider.noUiSlider.on('slide', function () { 
    let value = [Math.trunc(this.get()[0]), Math.trunc(this.get()[1])];
    minRange.value = value[0];
    maxRange.value = value[1];

    const targetContainer = document.querySelector('.ranges-wrapper.tooltip-target');
    
    if ( toolTip.visible === false){

        calcTooltipPosition(filtersList, targetContainer);
        toolTipContainer.classList.add('show');
        toolTip.show();
        
    } else{
        calcTooltipPosition(filtersList, targetContainer);
        toolTip.restart();
    }
        
  });

  IMask(
    minRange, {
      mask: Number,
      min: minValue,
      max: maxValue
  });
  
  IMask(
    maxRange, {
      mask: Number,
      min: minValue,
      max: maxValue
  });

}



  

/*---------------------------------------*/

const btnMobOpenCategory = document.querySelector('.mob-open-category');
if ( btnMobOpenCategory ){

        const productsList = document.querySelector('.cp-products-list');

        window.addEventListener('resize', function(){
            productsList.removeAttribute('style');
            btnMobOpenCategory.classList.remove('open');
        })

        btnMobOpenCategory.addEventListener('click', function(){
            
            const productsAccordionHeight = document.querySelector('.category-products-accordion').offsetHeight;
            let height = 480;
            
            if ( !this.classList.contains('open') ){
                this.classList.add('open');
                /*
                productsList.style.height = 'auto';
                productsList.style.maxHeight = '480px';
                
                */
                if ( productsAccordionHeight < 480  ) {
                    height = productsAccordionHeight;
                }
                anime({
                    targets: productsList,
                    maxHeight: '480px',
                    height: height,
                    
                    duration: 150,
                    easing: 'linear',
                    complete: function(){
                        productsList.style.overflowY = 'scroll';
                        productsList.style.height = 'auto';
                    }
                });
            } else{
                this.classList.remove('open');
                productsList.style.height = '0';
                productsList.style.maxHeight = 'unset';
                productsList.style.overflowY = 'unset';
                
            }

            
            
        })
}

const btnMobOpenFilters = document.querySelector('.mob-open-filters');


if ( btnMobOpenFilters ){
    

        const filtersList = document.querySelector('.filters-list');

        window.addEventListener('resize', function(){
            filtersList.removeAttribute('style');
            btnMobOpenFilters.classList.remove('open');
        })

        btnMobOpenFilters.addEventListener('click', function(){
            
            const filtersAccordionHeight = document.querySelector('.filters-acc').offsetHeight;
            let height = 480;
            
            if ( !this.classList.contains('open') ){
                this.classList.add('open');
                /*
                productsList.style.height = 'auto';
                productsList.style.maxHeight = '480px';
                
                */
                if ( filtersAccordionHeight < 480  ) {
                    height = filtersAccordionHeight;
                }
                anime({
                    targets: filtersList,
                    maxHeight: '480px',
                    height: height,
                    
                    duration: 150,
                    easing: 'linear',
                    complete: function(){
                        filtersList.style.overflowY = 'scroll';
                        filtersList.style.height = 'auto';
                    }
                });
            } else{
                this.classList.remove('open');
                filtersList.style.height = '0';
                filtersList.style.maxHeight = 'unset';
                filtersList.style.overflowY = 'unset';
                
            }

            
            
        })

}


    
document.body.addEventListener('click', function(event){
    let mobCategoryOpen = document.querySelector('.mob-open-category.open');  
    let mobFiltersOpen = document.querySelector('.mob-open-filters.open');  


    if ( mobCategoryOpen ){
        const outerWrap = event.target.closest('.cp-products-list-wrap');
        const productsList = document.querySelector('.cp-products-list');
        if ( !outerWrap ){
            mobCategoryOpen.classList.remove('open');
            productsList.style.height = '0';
            productsList.style.maxHeight = 'unset';
            productsList.style.overflowY = 'unset';
        }
    }

    if ( mobFiltersOpen ){
        const outerWrap = event.target.closest('.cp-filters-list-wrap');
        const filtersList = document.querySelector('.filters-list');
        if ( !outerWrap ){
            mobFiltersOpen.classList.remove('open');
            filtersList.style.height = '0';
            filtersList.style.maxHeight = 'unset';
            filtersList.style.overflowY = 'unset';
        }
    }
})





let ptoductThumbsSlider = new Swiper(".product__thumbs", {
    speed: 1000,
    
    slidesPerView: 'auto',
    spaceBetween: 6,
    
    
    breakpoints: {
        421: {
            direction: 'vertical',
            
            spaceBetween: 15,
        },
        1025: {
            direction: 'vertical',
            spaceBetween: 20,
        }
    }
    
  })
  
  const ptSlider = new Swiper(".product__big-slider", {
    speed: 1000,
    
    slidesPerView: 1,
    spaceBetween: 50,
    
    
    thumbs: {
      swiper: ptoductThumbsSlider
    },
    
  })

const thumbsSlides = document.querySelectorAll('.product__thumbs .swiper-slide');

if ( thumbsSlides.length ){
    thumbsSlides.forEach( (slide, index) => {
        slide.addEventListener('mouseenter', function(){            
            ptSlider.slideTo(index, 440, function(){});
        });

        
    })
}

Fancybox.bind("[data-fancybox]", {
    Image: {
      zoom: true,
    },
  });


/* Кнопки "помощь"  + опции модалки*/



  let options = {
    zIndex: 1000, 
    //background: 'rgba(12, 130, 121, 0.5)', 
    displayModalContainer: 'flex', 
    displayModal: 'block', 
  
    closeSelectors: ['.modal__close'], 
    closeModalOnFogClick: true, 
    showModalAnimation: 'fadeInBottom', 
    closeModalAnimation: 'fadeOutTop',  
    showModalDuration: '300ms',
    closeModalDuration: '500ms',
  
    showFogAnimation: 'fadeIn',
    closeFogAnimation: 'fadeOut',
    showFogDuration: '300ms',
    closeFogDuration: '500ms',
    documentCanScroll: false, 
  
    // 'modal-first' - сначала скрывается модальное окно - затем туман
    // 'along' - анимации закрытия тумана и окна происходят параллельно
    closeMode: 'modal-first',
    
    
    
  
  }
  

const helpBtns = document.querySelectorAll('.product__help');




if ( helpBtns.length ){
    helpBtns.forEach( btn => {
        btn.addEventListener('click', function(){
            let tagtetModal = this.getAttribute('data-src');
            
            if ( tagtetModal) {
                let modal = new easyModal(tagtetModal, options); 
            }

            
        });

    } )
}





