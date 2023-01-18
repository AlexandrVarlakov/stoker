


class easySelect extends EventTarget{
    constructor (selector, options){
        super();
        let self = this;


        this.select = document.querySelector(selector);

        


        this.scrollListBox = document.createElement('scroll-list-box');
        if ('onChange' in options){
            this.onChange = options.onChange;
        }

        if ( 'maxHeight' in options ){
            this.maxHeightList = options.maxHeight;            
        } else{
            this.maxHeightList = 300;            
        }

        this.scrollListBox.style.maxHeight = this.maxHeightList + 'px';


        //Иконка "открытия"
        this.openIcon = document.createElement('select-open-icon');

        if ( 'openIcon' in options){
            this.openIcon.innerHTML = options.openIcon;
        } else{
            const iconTriangle = document.createElement('div');
            iconTriangle.classList.add('open-triangle');
            this.openIcon.append(iconTriangle);
        }

        this.openIcon.addEventListener('click', openCloseItemsList);

        this.valueContainer = document.createElement('value-container');

        //Вставляем Иконку "открытия"
        this.valueContainer.append(this.openIcon);

        this.valueBox = document.createElement('value-box');

        this.valueWrap = document.createElement('value-wrap');


        if ( 'placeholder' in options){

            this.valuePlaceHolder = document.createElement('value-placeholder');
            this.valuePlaceHolder.innerHTML = options.placeholder;
            this.valueWrap.append(this.valuePlaceHolder);
        }



        function openCloseItemsList(){
            if ( !self.select.classList.contains('open') ){
                
                self.testHeight();

                

                self.select.classList.add('open');
                self.removeDisabledForSearchInput();
            } else{
                self.select.classList.remove('open');
                self.setDisabledForSearchInput();
                

                self.listBox.style.maxHeight = 0 + 'px';
            } 

            
        }





        this.valueWrap.addEventListener('click', openCloseItemsList);
            

        document.addEventListener('click', function(event){
            let targetClick = event.target.closest('easy-select');

            if ( !targetClick ){
                self.select.classList.remove('open');
                self.listBox.style.maxHeight = 0 + 'px';
            }
            
        })


        this.listBox = document.createElement('list-box');
        this.innerListBox = document.createElement('inner-list-box');

        this.optionsList = this.select.querySelectorAll('easy-option');

        //Создаем строку фильтра-поиска для
        if ('search' in options){
            this.searchInput = document.createElement('input');
            this.searchInput.type = 'text';
            this.searchInput.name = 'search';
            this.searchInput.setAttribute('disabled', 'disabled');

            if ('placeholder' in options.search){
                this.searchInput.placeholder = options.search.placeholder
            } else{
                this.searchInput.placeholder = 'Поиск...';
            }

            if ('resetSearchIcon' in options.search){
                this.resetSearch = document.createElement('reset-search');
                this.resetSearch.innerHTML = options.search.resetSearchIcon;
            } else{
                this.resetSearch = document.createElement('reset-search');

                const resetBtn = document.createElement('div');
                resetBtn.classList.add('reset-btn');

                this.resetSearch.append(resetBtn);
            }

            //Ввод в строку поиска
            this.searchInput.addEventListener('input', function(){
                if ( this.value.length ){
                    self.searchBlock.setAttribute('data-state', 'has-value');

                    let start = '';
                    if ( 'start' in options.search && options.search.start){
                        start = '^';
                    }
                    
                    let allCases = 'i';

                    if ( 'allCases' in options.search && options.search.allCases === false){
                        allCases = '';
                    }



                    const regexp = new RegExp(start + this.value, allCases);

                    self.optionsList.forEach( option => {
                        const optionSearchStr = option.getAttribute('data-search');
                        let result = optionSearchStr.match(regexp);

                        if ( !result ){
                            option.classList.add('hide');
                        } else{
                            option.classList.remove('hide');
                        }


                    })

                } else{
                    self.searchBlock.removeAttribute('data-state');

                    self.optionsList.forEach( option => {
                        option.classList.remove('hide');
                    })
                }

                self.testHeight();
            })

            //Сброс фильтра
            this.resetSearch.addEventListener('click', function(){
                self.searchInput.value = '';
                self.optionsList.forEach( option => {
                    option.classList.remove('hide');
                })
                self.searchBlock.removeAttribute('data-state', 'has-value');
                self.testHeight();
            });


            this.searchBlock = document.createElement('search-block');
            this.searchBlock.append(this.resetSearch);
            this.searchBlock.append(this.searchInput)
            this.innerListBox.append(this.searchBlock);
        }



        if ( 'target' in options ){
            this.target = options.target;

            switch (this.target){
                case 'form': 
                    this.inputForForm = document.createElement('input');
                    this.inputForForm.type = 'hidden';
                    this.inputForForm.name = this.select.getAttribute('name');
                    this.valueContainer.append(this.inputForForm);
                break;
            }
            
        }


        this.optionsList.forEach( option => {

            if ('search' in options){
                if ( !option.hasAttribute('data-search') ){
                    option.setAttribute('data-search', option.getAttribute('value'));
                }    
            }
            


            if (option.hasAttribute('selected')){
                this.valueBox.innerHTML = option.innerHTML;

                if ('inputForForm' in this){
                    this.inputForForm.value = option.getAttribute('value');
                }
            }

            this.innerListBox.append(option);


            option.addEventListener('click', function(){

                if ( !this.hasAttribute('selected') ){
                    self.select.querySelector('easy-option[selected]').removeAttribute('selected');
                    this.setAttribute('selected', '');
                    self.valueBox.innerHTML = this.innerHTML;

                    if ('inputForForm' in self){
                        self.inputForForm.value = this.getAttribute('value');
                    }
                            
                    self.select.classList.remove('open');

                    self.listBox.style.maxHeight = '0px';

                    self.setDisabledForSearchInput();

                    self.onChange(this.getAttribute('value'));
                    
                }

                
            })


        })
        
        this.select.append(this.valueContainer);

        
        this.valueWrap.append(this.valueBox);
        this.valueContainer.append(this.valueWrap);
        this.listBox.append(this.scrollListBox);
        this.select.append(this.listBox);
        this.scrollListBox.append(this.innerListBox);

        
        
        
    }

    setDisabledForSearchInput(){
        if ( this.searchInput ){
            this.searchInput.setAttribute('disabled', 'disabled');                        
        }
    }
    removeDisabledForSearchInput(){
        if ( this.searchInput ){
            this.searchInput.removeAttribute('disabled');                        
        }
    }

    //Метод устанавливает высоту выпадающего списка
    testHeight(){
        const height = this.scrollListBox.offsetHeight;
            
        if ( height > this.maxHeightList ){
            this.listBox.style.maxHeight = this.maxHeightList + 'px';
            
        } else{
            this.listBox.style.maxHeight = height + 'px';
        }

        
    }
}

