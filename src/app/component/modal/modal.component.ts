import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  styleUrls: ['./modal.component.scss'],
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-basic-title">Design Brief</h4>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        (click)="activeModal.dismiss('Cross click')"
      ></button>
    </div>
    <div class="modal-body">
      <ul>
        <ol>
          Create Azure Dev Ops Account.
        </ol>
        <ol>
          Create few Work Items, parent features w/ linked children.
        </ol>
        <ol>
          Create Auth token w/ Azure DevOps.
        </ol>
        <ol>
          Connect w/ Dev Ops API.
        </ol>
        <ol>
          Query work items in Azure Dev Ops, include all relationships.
        </ol>
        <ol>
        Prints out Item Id and Title for each level
        </ol>
        <ol>Each level must be represented by a new column</ol>
        <ol>
          Bonus: Write to an ADO work item.
        </ol>
      </ul>
    </div>`
})
export class ModalComponent {
  constructor(public activeModal: NgbActiveModal) { }
}
