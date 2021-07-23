
$( function() {

    var canvas = document.getElementById( 'mycanvas' );

    var cvs = canvas.getContext( '2d' );

    windowWidth = canvas.width = window.innerWidth

    windowHeight = canvas.height = window.innerHeight

    window.addEventListener( 'resize' , function( ) {

        windowWidth = canvas.width = window.innerWidth

        windowHeight = canvas.height = window.innerHeight

    } )

    // 定義  球  的 位置/速度/加速度/摩擦力/半徑/是否拖動
    var Ball = function() {

        this.position = { x: windowWidth / 2 , y: windowHeight / 2 },

        this.velocity = { x: 3 , y: 0 },

        this.acceleration = { x: 0 , y: 0.3 },

        this.radius = 50,

        this.dragging = false

    }
    
    // 球 的 繪製 方法
    Ball.prototype.draw = function() {

        cvs.save()

            cvs.translate( this.position.x , this.position.y );

            cvs.beginPath();

            cvs.arc( 0 , 0 , this.radius , 0 , Math.PI * 2 )

            cvs.closePath();

            cvs.fillStyle = controlsGui.color;

            cvs.fill()

        cvs.restore();

    }

    // 球 的 速度曲線
    Ball.prototype.updateDrawBall = function() {
        
        if ( ball.dragging == false ) {

            // 球的 ( 位置 和 速度 ) 更新 x 和 y 
            this.position.x = this.position.x + this.velocity.x

            this.position.y = this.position.y + this.velocity.y

            // 球的 ( 速度 和 加速度 ) 更新 
            this.velocity.x = this.velocity.x + this.acceleration.x;

            this.velocity.y = this.velocity.y + this.acceleration.y

            // 球的 最後 摩擦力 更新
            this.velocity.x = this.velocity.x * controlsGui.frictional

            this.velocity.y = this.velocity.y * controlsGui.frictional

            this.checkBoundary()

        }
        
        controlsGui.velocityX = this.velocity.x

        controlsGui.velocityY = this.velocity.y

        controlsGui.accelerationY = this.acceleration.y

    }   

    // 球 的 邊界碰撞判定
    Ball.prototype.checkBoundary = function() {

        if ( this.position.x + this.radius > windowWidth ) {

            this.velocity.x = -Math.abs( this.velocity.x )

        }

        if ( this.position.x - this.radius < 0 ) {

            this.velocity.x = Math.abs( this.velocity.x )

        }

        if ( this.position.y + this.radius > windowHeight ) {

            this.velocity.y = -Math.abs( this.velocity.y )

        }

        if ( this.position.y - this.radius < 0 ) {

            this.velocity.y = Math.abs( this.velocity.y )

        }

    }

    Ball.prototype.drawDirection = function() {

        cvs.save();

        cvs.translate( this.position.x , this.position.y )

        cvs.scale( 3 , 3 );

        cvs.beginPath()

        cvs.moveTo( 0 , 0 );
        
        cvs.lineTo( this.velocity.x , this.velocity.y )

        cvs.strokeStyle = 'blue'

        cvs.stroke();

        cvs.beginPath()

        cvs.moveTo( 0 , 0 );
        
        cvs.lineTo( 0 , this.velocity.y )

        cvs.strokeStyle = 'red'

        cvs.stroke();

        cvs.beginPath()

        cvs.moveTo( 0 , 0 );
        
        cvs.lineTo( this.velocity.x , 0 )

        cvs.strokeStyle = 'green'

        cvs.stroke();

        cvs.restore();

    }

    var controlsGui = {

        velocityX: 0,

        velocityY: 0,

        accelerationY: 0,

        frictional: 0.99,

        color: '#ffffff',

        ballUpdate: true,

        ballUpdateClick: function() {

            ball.updateDrawBall()

        },

        FPS: 30,

    }

    var gui = new dat.GUI()

    // listen() 控制台 可以 監視 並且 及時更改 然後附在 Gui 身上
    gui.add( controlsGui , 'velocityX' , -50 , 50 ).listen().onChange( function( eventX ) {

        ball.velocity.x = eventX

    } )

    gui.add( controlsGui , 'velocityY' , -50 , 50 ).listen().onChange( function( eventY ) {

        ball.velocity.y = eventY

    } )

    // step 可以轉換成以多少數值來控制
    gui.add( controlsGui , 'accelerationY' , -1 , 1 ).step( 0.1 ).listen().onChange( function( eventY ) { 

        ball.acceleration.y = eventY

    } )

    gui.add( controlsGui , 'frictional' , -1 , 1 ).step( 0.01 ).listen()

    gui.addColor( controlsGui , 'color' )

    gui.add( controlsGui , 'ballUpdate' )

    gui.add( controlsGui , 'ballUpdateClick' )

    gui.add( controlsGui , 'FPS' , 1 , 120 ).listen()

    // 新增一顆球
    var ball;

    // 初始化
    function initBall() {

        ball = new Ball()

    }

    initBall()

    // 球 的 位置定時更新
    function update() {

        if ( controlsGui.ballUpdate ) {

            ball.updateDrawBall();

        }

    }

    setInterval( update , 1000 / 30 )

    // 球 的 ( 繪畫 出來 ) 和 版面 的 ( 定時 顯現 ) 更新
    function draw() {

        cvs.fillStyle = 'rgba( 0 , 0 , 0 , 0.5 )'

        cvs.fillRect( 0 , 0 , windowWidth , windowHeight );

        ball.draw()

        ball.drawDirection();

        setTimeout( draw , 1000 / controlsGui.FPS )
        
    }

    draw()

    let mousePosition = { x: 0 , y: 0 };

    function getDistance( dotOne , dotTwo ) {

        let dotX = dotOne.x - dotTwo.x

        let dotY = dotOne.y - dotTwo.y

        let dist = Math.pow( dotX , 2 ) + Math.pow( dotY , 2 );

        return Math.sqrt( dist )

    }

    // 滑鼠按下事件
    canvas.addEventListener( 'mousedown' , function( event ) {

        mousePosition = { x: event.x , y: event.y };

        let dist = getDistance( ball.position , mousePosition )

        if ( dist < ball.radius ) {

            ball.dragging = true

        }

    } )

    // 滑鼠按下移動事件
    canvas.addEventListener( 'mousemove' , function( event ) {

        nowPosition = { x: event.x , y: event.y }

        if ( ball.dragging ) {

            let dotX = nowPosition.x - ball.position.x

            let dotY = nowPosition.y - ball.position.y

            ball.position.x = ball.position.x + dotX

            ball.position.y = ball.position.y + dotY

            ball.velocity.x = dotX  

            ball.velocity.y = dotY 

            
        }
        
        let dist = getDistance( ball.position , nowPosition ) 
        
        if ( dist < 50 ) {

            $( '#mycanvas' ).css( 'cursor' , 'move' )

        } else {

            $( '#mycanvas' ).css( 'cursor' , 'initial' )

        }

    } )

    // 滑鼠按下鬆手事件
    canvas.addEventListener( 'mouseup' , function() {

        ball.dragging = false

        $( '#mycanvas' ).css( 'cursor' , 'initial' )

    } )

} )
