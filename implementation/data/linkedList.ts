
/**
 * @class ListNode
 * @description class representing node in 
 *  linkedList
 */
class ListNode<T>{
    public next: ListNode<T> | null = null
    public data: T
    constructor(data: T) {
        this.data = data
    } 
}

/**
 * @class SortedLinkedList
 * @description class for sorted linked list with a pointer
 *  it is used for adjency lists in impemented algorithms
 */
export class SortedLinkedList<T>{
    public head: ListNode<T> | null = null
    private currPoint: ListNode<T> | null = this.head
    private compareFunction: (a: T, b: T) => boolean // true if a is "less then" b


    constructor(compareFunction: (a: T, b: T) => boolean) {
        this.compareFunction = compareFunction
    }

    /**
     * 
     * @param data element to be inserted
     * @description adds new node to its place given by
     *  compare function
     */
    public insertNode(data: T){
        const node: ListNode<T> = new ListNode<T>(data)
        if (this.head == null){
            this.head = node
            this.currPoint = this.head
            return
        }
        if (this.compareFunction(node.data, this.head.data)){
            
            node.next = this.head
            this.head = node
            return
    }
        let currNode = this.head
        while (currNode.next != null && !this.compareFunction(node.data, currNode.next.data)){
            currNode = currNode.next
        }
        node.next = currNode.next
        currNode.next = node
        if (this.currPoint == null) { this.currPoint = node }
    }

    /**
     * 
     * @param data element to be deleted
     * @description deletes element containing `data`
     *  from the list
     */
    public deleteNode(data: T){
        if (this.head == null) { return }
        if (data == this.head.data){
            this.head = this.head.next
            return
        }
        let currNode = this.head
        while(currNode.next != null){
            if (data == currNode.next.data){
                currNode.next = currNode.next.next
                return
            }
            currNode = currNode.next
        }
    }

    /**
     * @description returns data and sets the pointer
     *  to next element
     * @returns - null, if pointer is null
     *          - data of pointer, otherwise
     */
    public next(): T | null{
        if (this.currPoint == null){
            return null
        }
        let ret = this.currPoint
        this.currPoint = this.currPoint.next
        return ret.data
    }

    /**
     * @description sets the pointer to the first element
     */
    public reset(){
        this.currPoint = this.head
    }
}
