function DS(dsname) {
    this.sources = [dsname];
    this.joinOrder = [];
    this.targetList = [];

    this.select = function () {
        this.targetList = [];
        for (var i = 0; i < arguments.length; i++) {
            this.targetList.push(arguments[i]);
        }
        return this;
    }
    
    this.join = function(ds, joinClause) {
        // join with another dataset
        this.joinOrder = [];
        this.sources = this.sources.concat(ds.sources)
        this.joinOrder.push({'source': this.sources[0], 'jc': joinClause[0]}, {'source': this.sources[1], 'jc': joinClause[1]})
        return this
    }
    
    this.toQuery = function() {
        
        // evaluate target list
        var query = "SELECT * ";
        var c = 0
        var tlength = this.targetList.length
        if (tlength > 0){   
            query = "SELECT "
            this.targetList.forEach(function(o) { 
                                                c = c + 1
                                                query = query + o
                                                 if(c < tlength) {
                                                    query = query + ","
                                                 }         
                                    });
        }
        c = 0
        tlength = this.sources.length
        query = query + " FROM "
        this.sources.forEach(function(s) {
                                        c = c + 1
                                        query = query + s ;
                                        if(c < tlength) {
                                            query = query + ","
                                        }
        })
        
        // evaluate joins
        if(this.joinOrder.length > 0) {
            query = query + " INNER JOIN " + this.joinOrder[1].source + " ON (" + this.joinOrder[0].source + "." + this.joinOrder[0].jc + " = " + this.joinOrder[1].source + "." + this.joinOrder[1].jc + ")"
        }
        return query + ";";
    }
}




// tests
//var ds1 = new DS("table1").select("a");
//console.log(ds1.toQuery())
//var ds2 = new DS("table2").select("b");
//console.log(ds2.toQuery())
//
//var dsj = ds1.join(ds2,["a", "b"]).select("a", "b")
//console.log(dsj.toQuery())