var pagenumber=1;
var recordsperpage=20;
var totalcharacters=2138;

//Api call function returns json data
async function getdetails(url)
{
    let res=await fetch(url);
    var result=await res.json();
    return result;
}

// to dispaly book details that is searched
document.getElementById('booksearch').addEventListener('click',()=>{

   var name=document.getElementById('book').value
   document.getElementById('char_rec').style.display="none";
   document.getElementById('per_page').style.display='none';
   document.getElementById('text').style.display="none";
   document.getElementById('char_records').style.display="none";
   document.getElementById('book').value=" ";
   var table=document.getElementById('detail');
   
   
   var tbody=document.getElementById('characterdetails')
   tbody.innerHTML=" ";
   var bookdetails=getdetails('https://www.anapioficeandfire.com/api/books?name='+name);
   bookdetails.then(res=>{
      console.log(res);
       var caption=document.getElementById("bookdetails");
       var caption2=document.getElementById("povcharacters");
       caption2.innerText="POINT OF VIEW CHARACTERS"
       caption.innerText="BOOK NAME: "+res[0].name+"    AUTHOR: "+res[0].authors[0]+"    Publisher: "+res[0].publisher;
       if(res[0].povCharacters[0]!=null)
       {
            table.style.display="block";
            res[0].povCharacters.forEach(element => {
            var characterdetails=getdetails(element);
            characterdetails.then(char_res=>{
                 var tr=document.createElement('tr');
                 var char_name=document.createElement('td');
                 char_name.innerText=char_res.name;
                 var char_played=document.createElement('td');
                 char_played.innerText=char_res.playedBy[0];
                 var char_gender=document.createElement('td');
                 char_gender.innerText=char_res.gender;
 
                 var char_culture=document.createElement('td');
                 var char_aliases=document.createElement('td');
                 if(char_res.culture!=" ")
                 {
                     char_culture.innerText=char_res.culture;
                 }
                 if(char_res.aliases[0]!=" ")
                 {
                     char_res.aliases.forEach(alias=>{
                             char_aliases.innerText+=alias+","
                     });
                 }
 
                 var house_name=document.createElement('td');
                 var house_region=document.createElement('td');
                 var house_arms=document.createElement('td');
                 if(char_res.allegiances[0]!=" ")
                 {   
                     char_res.allegiances.forEach(house=>{
                         var housedetails=getdetails(house)
                         housedetails.then(house_res=>{
                             console.log(house_res);
                             house_name.innerText=house_res.name;
                             house_region.innerText=house_res.region;
                             if(house_res.ancestralWeapons[0]!=" ")
                             {
                                 house_res.ancestralWeapons.forEach(weapon=>{
                                     house_arms.innerText+=weapon;
                                 });
                             }
 
                         });
                     });
 
                 }
                 tr.append(char_name,char_gender,char_played,char_aliases,char_culture,house_name,house_region,house_arms)
                 tbody.append(tr);
            });
         });
       }
       else{
        

        table.style.display="none";
        var div=document.getElementById('text');
        div.innerHTML=" "
        var b_name=document.createElement('p');
        b_name.innerText="BOOK NAME:   "+res[0].name;
        var b_author=document.createElement('p');
        b_author.innerText="AUTHOR:    "+res[0].authors[0]
        var b_publisher=document.createElement('p');
        b_publisher.innerText="Publisher    :"+res[0].publisher;
        var pov=document.createElement('span');
        pov.innerText="NO POV CHARACTERS";
        div.append(b_name,b_author,b_publisher,pov);
        div.style.display="block";
        
       }
   })

});


// view all character button click in turn ask for records per page
document.getElementById('allchar').addEventListener('click',()=>{
    document.getElementById('text').style.display="none";
    document.getElementById('detail').style.display="none";
    document.getElementById('char_rec').style.display="none";
    document.getElementById('char_records').style.display="block";
    document.getElementById('per_page').style.display='none';
    

});

// number of records per page set the page number
document.getElementById('records').addEventListener('change',()=>{
    document.getElementById('per_page').style.display='block';
    recordsperpage=document.getElementById('records').value;
    var max=Math.floor(totalcharacters/recordsperpage);
    var page=document.getElementById('perpage');
    page.setAttribute('max',max);
    document.getElementById('char_records').style.display="none";
    
})

// choose pagenumber choose pagenumber and get details
document.getElementById('page').addEventListener('click',()=>{
    pagenumber=document.getElementById('perpage').value;
    getcharacters();
})


function getcharacters()
{
   
    var table=document.getElementById('char_rec');
    
    var tbody=document.getElementById('char_det')
    tbody.innerHTML=" ";
    
    let characterdetails=getdetails('https://www.anapioficeandfire.com/api/characters?page='+pagenumber+'&pagesize='+recordsperpage);
    characterdetails.then(charresult=>{
        charresult.forEach(char_res=>{
            if(char_res!="")
            {
                console.log(char_res);
               
                     var tr=document.createElement('tr');
                     var char_name=document.createElement('td');
                     char_name.innerText=char_res.name;
                     var char_played=document.createElement('td');
                     char_played.innerText=char_res.playedBy[0];
                     var char_gender=document.createElement('td');
                     char_gender.innerText=char_res.gender;
     
                     var char_culture=document.createElement('td');
                     
                     if(char_res.titles[0]!=" ")
                     {
                         char_culture.innerText=char_res.titles[0];
                     }
                    
     
                     var book_name=document.createElement('td');
                     if(char_res.books[0]!=" ")
                     {   
                         char_res.books.forEach(house=>{
                             var bookdetails=getdetails(house)
                             bookdetails.then(book_res=>{
                                 book_name.innerText=book_res.name;
                             });
                         });
     
                     }
                     tr.append(char_name,char_gender,char_played,char_culture,book_name)
                     tbody.append(tr);
                     table.style.display="block";  
            }
            else{
                console.log("no element")
            }
        });
    });
}




async function getbooks()
{
    let res=getdetails('https://www.anapioficeandfire.com/api/books')
    var books=document.getElementById('books')
    res.then((result)=>{
        for(i=0;i<result.length;i++)
        {
            var option=document.createElement('option')
            option.setAttribute("value",result[i].name)
            books.append(option)
        }
    });
}



getbooks()


