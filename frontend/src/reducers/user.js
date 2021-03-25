export default function(userToken = '', action) {
  
     if(action.type === 'ADD_TOKEN') {
       
        var newToken = action.payload;
        console.log(newToken,'<----- TOKEN OK')
        return newToken;
  
      } else {
          return userToken;
      }
   }