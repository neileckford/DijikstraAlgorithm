class NodeModel{

    constructor(name,x,y){
        this.name = name
        this.adjacentNodes = []
        this.totalCost = Infinity
        this.parent = null

        this.x = x * 130
        this.y = y * 130

        this.InPath = false
    }

    addDestination(destination, distance){
        this.adjacentNodes.push({
            destination: destination,
            distance: distance
        })
    }
}

export default NodeModel