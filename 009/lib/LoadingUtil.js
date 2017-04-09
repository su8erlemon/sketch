class LoadingUtil {

    multiLoad( funcList, callBack ){

        var loadCount = 0;
        for( var i = 0; i < funcList.length ; i++ ){
            funcList[i]( comp );
        }

        function comp(){
            loadCount++;
            if( loadCount >= funcList.length ){
                callBack();
            }
        }
    }

    scriptLoad( url, callBack ){
        var script = document.createElement( 'script' );

        script.type = 'text/javascript';
        script.src = url;

        var firstScript = document.getElementsByTagName( 'script' )[ 0 ];
        firstScript.parentNode.insertBefore( script, firstScript );

        script.onload = callBack;

    }
}

export{LoadingUtil};