// import Lightbox from 'https://cdn.jsdelivr.net/npm/bs5-lightbox@1.8.3/dist/index.bundle.min.js'


$(document).ready(function () {

    $(".multicard-carousel").each(function () {
        let carouselInner = $(this).find(".carousel-inner");
        let cardWidth = $(this).find(".carousel-item").width();
        let scrollPosition = 0;

        //Setup carousel buttons
        //TODO: smoother animations. Like blending queued animations better
        ///Also there's a weird glitch regarding hovering a control, then leaving the carousel and hovering the other which caused the click event to not fire the first time
        $(this).find(".carousel-control-next").on("click", function () {
            if (scrollPosition < (carouselInner[0].scrollWidth - cardWidth * 4)) { //check if you can go any further
                scrollPosition += cardWidth * 2;  //update scroll position
                carouselInner.animate({ scrollLeft: scrollPosition }, 400); //scroll left
            }
        }
        );
        $(this).find(".carousel-control-prev").on("click", function () {
            if (scrollPosition > 0) {
                scrollPosition -= cardWidth * 2;
                carouselInner.animate(
                    { scrollLeft: scrollPosition },
                    400
                );
            }
        }
        );


        

        var carousel = new bootstrap.Carousel(this, {
            interval: false
          });

        // if (window.matchMedia("(min-width: 768px)").matches) {
        //     //rest of the code
        //     var carousel = new bootstrap.Carousel(this, {
        //       interval: false
        //     });
        //   } else {
        //     $(this).addClass("slide");
        //   }
    });

    

    $(".project-list").each(function () {
        // let listItemWidth = $(this).find(".project-list-item").left
        let projectList = this;
        let listItems = $(this).find(".project-list-item");
        let left1=0,left2=0,listItemOffset=0;
        function calculateListItemOffset(){
            left1 = listItems[0].getBoundingClientRect().left;
            left2 = listItems[1].getBoundingClientRect().left;
            listItemOffset = left2 - left1;
        }
        calculateListItemOffset();

        let targetScrollPosition = 0;

        let isHeld = false; ///true if the mouse, touch, or pen is held down on the project-list-inner div
        let holdPosition = 0; ///the position of the mouse, touch, or pen when it was held down
        
        let inner = $(this).find(".project-list-inner");

        let prevButton = $(this).find(".project-list-control-prev");
        let nextButton = $(this).find(".project-list-control-next");

        window.addEventListener("resize", calculateListItemOffset);
        

        function getNearestListItem(fromPos=null) {
            if(fromPos == null) fromPos = inner.scrollLeft();
            let nearestListItem = Math.round(fromPos / listItemOffset) * listItemOffset;
            return nearestListItem;
        }
        

        prevButton.on("click", function () {
            // console.log("innner.scrollLeft: " + inner.scrollLeft(), "listItemOffset: " + listItemOffset);
            // let scrollPosition = inner.oag
            if (inner.scrollLeft() > 0) {
                let nearestListItem = getNearestListItem();
                let target = nearestListItem - listItemOffset;
                targetScrollPosition = target;
                

                // inner.animate(
                //     { scrollLeft: target },
                //     // 400
                //     {duration: 400}
                // );
            }
        }
        );

        nextButton.on("click", function () {
            // console.log("next-clicked");
            if (inner.scrollLeft() <  (inner[0].scrollWidth - listItemOffset)) { //check if you can go any further
                let nearestListItem = getNearestListItem();// Math.round(inner.scrollLeft() / listItemOffset) * listItemOffset;
                let target = nearestListItem + listItemOffset;
                targetScrollPosition = target;
                

                // inner.animate({ scrollLeft: target }, 
                //     // 400
                //     {duration: 400}
                //     );
                
            }
        }
        );

        ///When any button in the project-list-indicators div is clicked, scroll to the corresponding project-list-item. data("ds-slide-to") is the index of the project-list-item
        $(this).find(".project-list-indicators").on("click", function (e) {
            if (e.target.tagName == "BUTTON") {
                let target = $(e.target).data("ds-slide-to") * listItemOffset;
                targetScrollPosition = target;
                // inner.animate({ scrollLeft: target }, 
                //     // 400
                //     {duration: 400}
                //     ); //scroll left
                
            }
        });


        //On scroll, update the active indicator
        inner.on("scroll", function () {
            let nearestListItem = Math.round(inner.scrollLeft() / listItemOffset) * listItemOffset;
            let target = nearestListItem / listItemOffset;
            $(projectList).find(".project-list-indicators .active").removeClass("active");
            $(projectList).find(".project-list-indicators button").eq(target).addClass("active");
        });

        ///Called when mouse or touch is held down, or pen is touching the screen
        function onHoldStart() {
            isHeld = true;
            holdPosition = inner.scrollLeft();
        }

        ///Called when mouse or touch is released, or pen is lifted off the screen
        function onHoldEnd() {
            isHeld = false;
            let scrollPos = inner.scrollLeft();
            let delta = scrollPos - holdPosition;
            if( delta > listItemOffset/4 && delta < listItemOffset/2){
                targetScrollPosition = getNearestListItem(scrollPos + listItemOffset);
            }else if(delta < -listItemOffset/4 && delta > -listItemOffset/2){
                targetScrollPosition = getNearestListItem(scrollPos - listItemOffset);
            }else{
                targetScrollPosition = getNearestListItem();
            }
        }


        //On mouse down, set isHeld to true
        inner.on("mousedown", function () {
            onHoldStart();
            // isHeld = true;
            // holdPosition = inner.scrollLeft();
        });

        //On mouse up, set isHeld to false
        inner.on("mouseup", function () {
            onHoldEnd();
            // isHeld = false;

            // ///Nailed it, perfect. Essentially, if they dragged it at least a quarter of the way to the next item, we assume we wanted to go all the way to the next item.
            // let scrollPos = inner.scrollLeft();
            // let delta = scrollPos - holdPosition;
            // if( delta > listItemOffset/4 && delta < listItemOffset/2){
            //     targetScrollPosition = getNearestListItem(scrollPos + listItemOffset);
            // }else if(delta < -listItemOffset/4 && delta > -listItemOffset/2){
            //     targetScrollPosition = getNearestListItem(scrollPos - listItemOffset);
            // }else{
            //     targetScrollPosition = getNearestListItem();
            // }
        });

        ///On mouse leave, set isHeld to false
        inner.on("mouseleave", function () {
            isHeld = false;
            // targetScrollPosition = getNearestListItem();
        });

        inner.on("touchstart", function () {
            onHoldStart();
            // isHeld = true;
            // holdPosition = inner.scrollLeft();
            console.log("touchstart");
        });

        inner.on("touchend", function () {
            onHoldEnd();
            // isHeld = false;
            // targetScrollPosition = getNearestListItem();
            console.log("touchend");
        });

        inner.on("touchcancel", function () {
            isHeld = false;
            // targetScrollPosition = getNearestListItem();
            console.log("touchcancel");
        });

        inner.on("touchleave", function () {
            isHeld = false;
            // targetScrollPosition = getNearestListItem();
            console.log("touchleave");
        });


        //Animation loop
        function animate() {
            if(isHeld) return;
            
            // //Untested, and a bit messy. Trying to make compatible with drag-scroll's velocity effects
            // if(inner[0].getAttribute('ds-drag-scroll-state') != 'idle'){
            //     targetScrollPosition = getNearestListItem();
            //     return;
            // }

            let scrollPosition = inner.scrollLeft();
            let delta = targetScrollPosition - scrollPosition;
            if(Math.abs(delta) < 0.75) return;
            let speed = 0.1;
            let velocity = delta * speed;
            if(velocity > 0 && velocity < 1)velocity=1;
            if(velocity < 0 && velocity > -1)velocity=-1;

            let newPosition = scrollPosition + velocity;
            inner.scrollLeft(newPosition);
        }
      
        setInterval(animate, 1000 / 60);
    });



    $(".drag-scroll").each(function () {
        let velocity = {x:0,y:0};
        let lastTime = 0;
        let lastPosition = {x:0,y:0};
        let deltaPosition = {x:0,y:0};

        this.setAttribute('ds-drag-scroll-state', 'idle');
        
        function onHoldStart(e){
            // e.preventDefault();
            this.classList.add('active');
            
            // this.lastX = e.clientX;
            // this.lastY = e.clientY;
            if(e.type.startsWith('touch')){
                this.lastX = e.touches[0].clientX;
                this.lastY = e.touches[0].clientY;
            }else{
                this.lastX = e.clientX;
                this.lastY = e.clientY;
            }

            lastTime = Date.now();
            lastPosition.x = this.scrollLeft;
            lastPosition.y = this.scrollTop;
            
            if(e.type == 'touchstart'){
                ///TODO
                this.addEventListener('touchmove', onDrag);
                this.addEventListener('touchend', onHoldEnd);
                this.addEventListener('touchcancel', onHoldEnd);
                this.addEventListener('touchleave', onHoldEnd);
            }else{
                this.addEventListener('mousemove', onDrag);
                this.addEventListener('mouseup', onHoldEnd);
            }
        }

        function onDrag(e){
            //We're either gonna need to remove this or find a way to still allow vertical scrolling
            // e.preventDefault();

            const multiplier = 2;
            const velocityMultiplier = 1.5;

            let clientX=0;
            let clientY=0;
            

            if(e.type == 'touchmove'){
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            }else{
                clientX = e.clientX;
                clientY = e.clientY;
            }

            let dx = clientX - this.lastX;
            let dy = clientY - this.lastY;
            

            dx *= multiplier;
            dy *= multiplier;

            this.lastX = clientX;
            this.lastY = clientY;
            
            let currentTime = Date.now();
            let dt = currentTime - lastTime;
            lastTime = currentTime;

            deltaPosition.x = this.scrollLeft - lastPosition.x;
            deltaPosition.y = this.scrollTop - lastPosition.y;

            lastPosition.x = this.scrollLeft;
            lastPosition.y = this.scrollTop;

            if(dt > 0){
                let newVelocity = {x:0,y:0};
                newVelocity.x = deltaPosition.x / dt;
                newVelocity.y = deltaPosition.y / dt;

                //Average the new velocity with the old velocity
                velocity.x = (velocity.x + newVelocity.x) / 2;
                velocity.y = (velocity.y + newVelocity.y) / 2;
                // velocity.x = deltaPosition.x / dt;
                // velocity.y = deltaPosition.y / dt;

                // velocity.x *= velocityMultiplier;
                // velocity.y *= velocityMultiplier;
            }
            
            this.scrollLeft -= dx; ///Test, faster scrolling
            this.scrollTop -= dy; ///Test, faster scrolling

            console.log("On drag","dx",dx,"dy",dy,"dt",dt,"velocity",velocity.x,velocity.y);
        }

        function onHoldEnd(e){
            // e.preventDefault();
            this.classList.remove('active');
            
            this.removeEventListener('mousemove', onDrag);
            this.removeEventListener('mouseup', onHoldEnd);

            this.removeEventListener('touchmove', onDrag);
            this.removeEventListener('touchend', onHoldEnd);
            this.addEventListener('touchcancel', onHoldEnd);
                this.addEventListener('touchleave', onHoldEnd);

            this.setAttribute('ds-drag-scroll-state', 'coasting');
        }



        function mouseDown(e) {
            e.preventDefault();
            this.classList.add('active');
            this.lastX = e.clientX;
            this.lastY = e.clientY;

            lastTime = Date.now();
            lastPosition.x = this.scrollLeft;
            lastPosition.y = this.scrollTop;
            this.addEventListener('mousemove', mouseMove);
            this.addEventListener('mouseup', mouseUp);

            this.setAttribute('ds-drag-scroll-state', 'dragging');
        }

        function mouseMove(e) {
            const multiplier = 2;
            const velocityMultiplier = 1.5;

            e.preventDefault();
            let dx = e.clientX - this.lastX;
            let dy = e.clientY - this.lastY;

            dx *= multiplier;
            dy *= multiplier;

            this.lastX = e.clientX;
            this.lastY = e.clientY;
            
            let currentTime = Date.now();
            let dt = currentTime - lastTime;
            lastTime = currentTime;

            deltaPosition.x = this.scrollLeft - lastPosition.x;
            deltaPosition.y = this.scrollTop - lastPosition.y;

            lastPosition.x = this.scrollLeft;
            lastPosition.y = this.scrollTop;

            if(dt > 0){
                let newVelocity = {x:0,y:0};
                newVelocity.x = deltaPosition.x / dt;
                newVelocity.y = deltaPosition.y / dt;

                //Average the new velocity with the old velocity
                velocity.x = (velocity.x + newVelocity.x) / 2;
                velocity.y = (velocity.y + newVelocity.y) / 2;
                // velocity.x = deltaPosition.x / dt;
                // velocity.y = deltaPosition.y / dt;

                // velocity.x *= velocityMultiplier;
                // velocity.y *= velocityMultiplier;
            }
            
            this.scrollLeft -= dx; ///Test, faster scrolling
            this.scrollTop -= dy; ///Test, faster scrolling

            // console.log(velocity);
        }

        function mouseUp(e) {
            // e.preventDefault();
            this.classList.remove('active');
            this.removeEventListener('mousemove', mouseMove);
            this.removeEventListener('mouseup', mouseUp);
            this.setAttribute('ds-drag-scroll-state', 'coasting');
        }

        function update(){
            if(!this.classList.contains('active') && this.getAttribute('ds-drag-scroll-state') == 'coasting'){
                let timeSinceRelease = Date.now() - lastTime;

                // if(timeSinceRelease>2000)return;

                this.scrollLeft += Math.round(velocity.x);
                this.scrollTop += Math.round(velocity.y);

                // if(timeSinceRelease > 500){
                //     velocity.x *= 0.95;
                //     velocity.y *= 0.95;
                // }

                // if(Math.abs(velocity.x) < 2 && Math.abs(velocity.y) < 2){
                //     this.setAttribute('ds-drag-scroll-state', 'idle');
                // }

                if(timeSinceRelease > 500){
                    this.setAttribute('ds-drag-scroll-state', 'idle');
                }
                // velocity.x = Math.round(velocity.x * 0.98);
                // velocity.y = Math.round(velocity.y * 0.98);
                // velocity.y *= 0.98;

                // let delta = {x:this.scrollLeft - initialScroll.x,y:this.scrollTop - initialScroll.y};
                // console.log("coasting ",velocity);
            }
        }

        ///Removing temporarily
        // setInterval(update.bind(this), 1000/60);


        this.addEventListener('mousedown', onHoldStart);
        this.addEventListener('touchstart', onHoldStart);
    });

    function updateFadeInView(){
        $(".fade-in-view:not(.show)").each(function () {
            ///Padding will be a percentage of the viewport height
            let padding = $(window).height() * 0.1;
            
            let element = $(this);
            let elementTop = element.offset().top;
            let elementBottom = elementTop + element.outerHeight();
            let viewportTop = $(window).scrollTop();
            let viewportBottom = viewportTop + $(window).height();

            
    
            // if (elementBottom > viewportTop && elementTop < viewportBottom) {
            //     element.addClass("show");
            // }

            if(elementBottom > viewportTop + padding && elementTop < viewportBottom - padding){
                element.addClass("show");
                console.log(element,"revealed");
            }
        });
    }

    ///On document scroll
    $(window).on("scroll", function () {
        updateFadeInView();
    });

    updateFadeInView();
   
    
});


// var carouselWidth = $(".carousel-inner")[0].scrollWidth;
// var cardWidth = $(".carousel-item").width();
// var scrollPosition = 0;
// $(".carousel-control-next").on("click", function () {
//     if (scrollPosition < (carouselWidth - cardWidth * 4)) { //check if you can go any further
//         scrollPosition += cardWidth;  //update scroll position
//         $(".carousel-inner").animate({ scrollLeft: scrollPosition }, 600); //scroll left
//     }
// });
// $(".carousel-control-prev").on("click", function () {
//     if (scrollPosition > 0) {
//         scrollPosition -= cardWidth;
//         $(".carousel-inner").animate(
//             { scrollLeft: scrollPosition },
//             600
//         );
//     }
// });