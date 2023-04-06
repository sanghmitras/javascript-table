var data = []
var columns = [
    {id:1, display: 'ID', slug:'id'},
    {id:2, display: 'Name', slug: 'name'},
    {id:3, display: 'Destination', slug:'destination'},
    {id:3, display: 'Country', slug:'country'},
    {id:4, display: 'Action', slug:'action'}
];

var sorting_flag = {id:null, sortingType:'asc'}
function fetchData(){
    let d =[  
        {    "id": "ab324",    "name": "Evelyn",    "destination": "London", "country": 'India' },  
        {    "id": "cd563",    "name": "Lucas",    "destination": "Tokyo"  ,"country": 'India'},  
        {    "id": "ef678",    "name": "Avery",    "destination": "New York"  ,"country": 'India'},  
        {    "id": "gh901",    "name": "Landon",    "destination": "Paris"  ,"country": 'India'},  
        {    "id": "ij234",    "name": "Lila",    "destination": "Barcelona"  ,"country": 'India'},  
        {    "id": "kl567",    "name": "Nathan",    "destination": "Sydney"  ,"country": 'India'},  
        {    "id": "mn890",    "name": "Eleanor",    "destination": "Rome"  ,"country": 'India'},  
        {    "id": "op123",    "name": "Oliver",    "destination": "Amsterdam"  ,"country": 'India'},  
        {    "id": "qr456",    "name": "Emma",    "destination": "Dubai"  ,"country": 'India'},  
        {    "id": "st789",    "name": "William",    "destination": "Rio de Janeiro","country": 'India'},
    ]
    data = d;
    setHeader()
    setDataToTable(data)
}

function setDataToTable(data){
    let table = document.getElementById('table-body');
    table.innerHTML = '';
    data.map((item,index)=>{
        let row = table.insertRow(index);
        columns.map((col, index)=>{
            let cell = row.insertCell(index)
            if(col.slug==='action'){
                cell.innerHTML = `
                <div class="row-action-btn-box">
                <input type="checkbox" value="${item.id}" ${item.isSelect?'checked':''} />
                ${!item.isEdit?`<button id="edit-btn-${item.id}" value="edit-btn-${item.id}" name="edit-button">Edit</div>`:
                `<button id="save-btn-${item.id}" value="save-btn-${item.id}" name="save-button">Save</div>`
                }
                </div>
                `
            }else{
                if(col.slug!='id'){
                    cell.innerHTML = !item.isEdit ? item[col.slug]:`<input type="text" name="input-${col.slug}-${item[col.slug]}" value="${item[col.slug]}" />`
                }else{
                    cell.innerHTML = item[col.slug]
                }
            }
            
        })
    })
    setHeader()
}
function setHeader(){
    let table = document.getElementById('table');
    let table_head = document.getElementById('table-head') 

    if(table_head.innerHTML){
        table_head.innerHTML = ''
    }

    let header = table.createTHead();
    let row = header.insertRow(0);

    columns.map((item, index)=>{
        let c = row.insertCell(index)
        c.innerHTML = `<div value=${item.id} style="cursor:pointer; min-width: 150px;"}>${item.display} ${item.id==sorting_flag.id ? sorting_flag.sortingType=='asc'?'↓':'↑':''}</div>`
    });
}
function sortData(key){
    
    if(sorting_flag.id === key){
        sorting_flag.sortingType = sorting_flag.sortingType == 'asc'?'desc':'asc';    
    }else{
        sorting_flag = {id: key, sortingType:'asc'}
    }

    data = data.sort((itemA, itemB)=>{
        let sortingCol = columns.find(i=>i.id==key)
        if(itemA[sortingCol.slug] > itemB[sortingCol.slug]){
            return sorting_flag.sortingType === 'asc'? -1:1
        }else if(itemA[sortingCol.slug] < itemB[sortingCol.slug]){
            return sorting_flag.sortingType === 'asc'? 1:-1
        }else{
            return 0;
        }
    })
    setDataToTable(data)
}
function selectRow(){
    let row = document.querySelectorAll('tr')
    row.forEach(tr=>{
        let changeCSS = false;
        for(let i=0; i<columns.length; i++){
            console.log('td ', tr.cells[i]);
            console.log('td><><><',);
        }
        
    })
   
}

let root = document.getElementById('root');

root.addEventListener('click', function(event){
    if(columns.find(item=>item.id==event.target.getAttribute("value"))){
        sortData(event.target.getAttribute("value"))
    }

    // checkbox
    if(event.target.getAttribute('type')=='checkbox'){
        data = data.map(item=>{
            if(item.id==event.target.getAttribute("value")){
                if(event.target.checked){
                    return {...item, isSelect:true}
                }else{
                    return {...item, isSelect:false}
                }     
            }
            return item
        })
        if(data.find(i=>i.isSelect)){
            document.getElementById('remove-btn').style.display = 'block'
        }else{
            document.getElementById('remove-btn').style.display = 'none'
        }

        setDataToTable(data)
        // event.target.parentElement.style.background = "#f09e9e";
    }
    if(event.target.getAttribute("name")==='edit-button'){
        console.log('edit button event', event.target)
        let id = event.target.getAttribute('id')
        id = id.split("-")[2]
        console.log('btn id', id);
        data = data.map(item=>{
            if(item.id===id){
                item = {...item, isEdit:true}
            }
            return item
        })
        setDataToTable(data)
    }
    if(event.target.getAttribute('name')==='save-button'){
        let id = event.target.getAttribute("value").split('-')[2]
        if(confirm("Do you want to save this field?")===true){
            data = data.map(item=>{
                if(item.id===id){
                    let availableKeys = Object.keys(item)
                    let tempKeys = availableKeys.filter(avail_key=>avail_key.startsWith('temp-'))
                    tempKeys.map(temp_items=>{
                        let k = temp_items.split('-')[1]
                        item = {...item, [k]: item[temp_items], isEdit: false}
                    })

                }
                return item
            })
            setDataToTable(data)
            // console.log('data>>', data)
        }

    }
    
})
document.getElementById('remove-btn').addEventListener('click', function(){
    
    if(confirm('Do you want to remove selected Rows?')===true){
        data = data.filter(i=>!i.isSelect)
        setDataToTable(data)
        document.getElementById('remove-btn').style.display = 'none'
    }
})
document.getElementById('reset-btn').addEventListener('click', function(){
    fetchData()
})
document.addEventListener('DOMContentLoaded', fetchData())
root.addEventListener('input', function(event){
    const name = event.target.getAttribute("name")
    const col_name = name.split('-')[1]
    const cell_value = name.split('-')[2]
    data = data.map(row_items=>{
        if(row_items[col_name] == cell_value){
            let key = 'temp-'+col_name
            row_items = {...row_items, [key]: event.target.value}
        }
        return row_items
    })
})
