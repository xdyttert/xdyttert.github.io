import { ref, type UnwrapRef } from "vue"
import data from "./data"


class ListNode<T>{
    public next: ListNode<T> | null = null
    public data: T
    constructor(data: T) {
        this.data = data
    } 
}

export class SortedLinkedList<T>{
    public head: ListNode<T> | null = null
    private currPoint: ListNode<T> | null = this.head
    private compareFunction: (a: T, b: T) => boolean // true if a is "less then" b
    constructor(compareFunction: (a: T, b: T) => boolean) {
        this.compareFunction = compareFunction
    }

    public isLength1(): boolean{
        return !this.isEmpty() && this.head?.next == null
    }

    public isEmpty(): boolean{
        return this.head == null
    }

    public insertNode(data: T){
        const node: ListNode<T> = new ListNode<T>(data)
        if (this.head == null){
            this.head = node
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
    }

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

    public next(): T | null{
        if (this.currPoint == null){
            return null
        }
        let ret = this.currPoint
        this.currPoint = this.currPoint.next
        return ret.data
    }

    public reset(){
        this.currPoint = this.head
    }
}
