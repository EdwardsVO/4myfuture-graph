import {
  near,
  BigInt,
  json,
  JSONValueKind,
  log,
  bigInt,
} from "@graphprotocol/graph-ts";
import { Contribution, Proposal, Container } from "../generated/schema";

export function handleReceipt(receipt: near.ReceiptWithOutcome): void {
  const actions = receipt.receipt.actions;

  for (let i = 0; i < actions.length; i++) {
    handleAction(
      actions[i],
      receipt.receipt,
      receipt.block.header,
      receipt.outcome,
      receipt.receipt.signerPublicKey
    );
  }
}

function handleAction(
  action: near.ActionValue,
  receipt: near.ActionReceipt,
  blockHeader: near.BlockHeader,
  outcome: near.ExecutionOutcome,
  publicKey: near.PublicKey
): void {
  if (action.kind !== near.ActionKind.FUNCTION_CALL) {
    log.info("Early return: {}", ["not a function call"]);
    return;
  }
  const functionCall = action.toFunctionCall();

  if (functionCall.methodName == "create_proposal") {
    log.info("create proposal", []);
    let jsonDataProposal = outcome.logs[0];
    let parsedJSONProposal = json.fromString(jsonDataProposal);
    let id = "";
    let owner = "";
    let status = "";
    let image = "";

    if (parsedJSONProposal.kind == JSONValueKind.OBJECT) {
      let entry = parsedJSONProposal.toObject();
      for (let i = 0; i < entry.entries.length; i++) {
        let key = entry.entries[i].key.toString();
        log.info("key:{}", [key]);

        switch (true) {
          case key == "id":
            id = entry.entries[i].value.toString();
            break;
          case key == "owner":
            owner = entry.entries[i].value.toString();
            break;
          case key == "status":
            status = entry.entries[i].value.toI64().toString();
            break;
          case key == "image":
            image = entry.entries[i].value.toString();
        }
      }
    }

    let jsonDataProposalMetadata = outcome.logs[1];
    let parsedJSONProposalMetadata = json.fromString(jsonDataProposalMetadata);
    let metadata_id = "";
    let title = "";
    let description = "";
    let goal = "";
    let init_date = "";
    let finish_date = "";
    let funds = "";
    //let images:string[] = []
    let institution_link = "";
    let pensum_link = "";

    if (parsedJSONProposalMetadata.kind == JSONValueKind.OBJECT) {
      let entry = parsedJSONProposalMetadata.toObject();

      for (let i = 0; i < entry.entries.length; i++) {
        let key = entry.entries[i].key.toString();
        log.info("key:{}", [key]);

        switch (true) {
          case key == "id":
            metadata_id = entry.entries[i].value.toString();
            break;
          case key == "title":
            title = entry.entries[i].value.toString();
            break;
          case key == "description":
            description = entry.entries[i].value.toString();
            break;
          case key == "goal":
            goal = entry.entries[i].value.toString();
            break;
          case key == "init_date":
            init_date = entry.entries[i].value.toString();
            break;
          case key == "finish_date":
            finish_date = entry.entries[i].value.toString();
            break;
          case key == "funds":
            funds = entry.entries[i].value.toString();
            break;
          case key == "insitution_link":
            institution_link = entry.entries[i].value.toString();
            break;
          case key == "pensum_link":
            pensum_link = entry.entries[i].value.toString();
            break;
        }
      }
    }

    let container = new Container(metadata_id);
    container.id = metadata_id;
    container.title = title;
    container.description = description;
    container.goal = goal;
    container.init_date = init_date;
    container.finish_date = finish_date;
    container.funds = funds;
    container.institution_link = institution_link;
    container.pensum_link = pensum_link;
    
    let proposal = new Proposal(id);
    proposal.id = id;
    proposal.owner = owner;
    proposal.status = BigInt.fromString(status);
    proposal.image = image;
    // proposal.container
    
    proposal.save();
    container.save()
    log.info("Proposal saved", []);
  }


  //CONTRIBUTION CREATION TRIGGER
  if (functionCall.methodName == "contribute") {
    let jsonDataContribution = outcome.logs[0];
    let parsedJSONContribution = json.fromString(jsonDataContribution);
    let id = "";
    let from = "";
    let to = "";
    let proposal_id = "";
    let amount = "";
    let image = "";

    if (parsedJSONContribution.kind == JSONValueKind.OBJECT) {
      let entry = parsedJSONContribution.toObject();

      for (let i = 0; i < entry.entries.length; i++) {
        let key = entry.entries[i].key.toString();
        log.info("key:{}", [key]);

        switch (true) {
          case key == "id":
            id = entry.entries[i].value.toString();
            break;
          case key == "from":
            from = entry.entries[i].value.toString();
            break;
          case key == "to":
            to = entry.entries[i].value.toString();
            break;
          case key == "proposal_id":
            proposal_id = entry.entries[i].value.toString();
            break;
          case key == "amount":
            amount = entry.entries[i].value.toI64().toString();
            break;
          case key == "image":
            image = entry.entries[i].value.toString();
        }
      }
    }
    let contribution = new Contribution(id);
    contribution.id = id;
    contribution.from = from;
    contribution.to = to;
    contribution.proposal_id = proposal_id;
    contribution.amount = BigInt.fromString(amount);
    contribution.image = image;
    contribution.save();
  }
}
