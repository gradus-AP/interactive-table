const items = [
    {id:1, name:'apple', unit_price:100, stock:10},
    {id:2, name:'orange', unit_price:40, stock:30},
    {id:3, name:'grape', unit_price:1000, stock:60},
    {id:4, name:'banana', unit_price:300, stock:100},
]

class TableModel {
    constructor(data) {
        this.data = data;
        this.tableItems = data;
        this._listeneres = {'search':[], 'sort':[]};
    }
    /**
     * イベントの登録を行う
     * @param {*} type イベント
     * @param {*} callback イベントハンドラ
     */
    on(type, callback) {
        this._listeneres[type].push(callback);
    }
    /**
     * 登録イベントを実行
     * @param {*} type イベント
     */
    trigger(type) {
        this._listeneres[type].forEach(callback => {
            callback();
        });
    }
    /**
     * tableItemsに対しnameをキーにして抽出を行う
     * @param {*} name 名称
     */
    selectByName(name) {
        this.tableItems = this.data.filter((e) => e.name===name);
        this.trigger('search');
    }
    /**
     * 引数で指定した列名に関してtableItemsをsortを行う
     * @param {*} columnName 列名
     */
    sortBy(columnName) {
        this.tableItems = this.data.sort((e1, e2) => e1[columnName] - e2[columnName]);
        this.trigger('sort');
    }
}

class TableView {
    constructor(data) {
        this.tableItems = data;
        this.model = new TableModel(data);
        this.tableElement = document.querySelector('.items');
        this.searchButton = document.getElementsByTagName('button')[0];
        this.tableColumnElements = document.querySelectorAll('.row-header > th');
        this.init()
    }
    createTableItemsHTML(tableItems) {
        return(tableItems.
            map((e) => `<tr><th scope="row">${e.id}</th><td>${e.name}</td><td>${e.unit_price}</td><td>${e.stock}</td></tr>`).
            join('\n'))
    }
    init() {
        this.tableElement.innerHTML = this.createTableItemsHTML(this.tableItems);
        
        // search時に対して再描画するメソッド
        this.model.on('search', () => {
            this.tableElement.innerHTML = this.createTableItemsHTML(this.model.tableItems);
        })

        // 検索ボタン押下時にmodelのtableItemsを更新する
        this.searchButton.addEventListener('click', (e) => {
            this.model.selectByName(document.getElementById('item_name').value);
        })

        // sort時にmodelのtableItemsを更新する
        this.model.on('sort', () => {
            this.tableElement.innerHTML = this.createTableItemsHTML(this.model.tableItems);
        })

        // 列名押下時にmodelのtableItemsを更新する
        this.tableColumnElements.forEach((colElment) => {
            colElment.addEventListener('click', (e) => {
                this.model.sortBy(e.currentTarget.getAttribute('data-colName'));
            })
        })
    }
}

const app = new TableView(items);