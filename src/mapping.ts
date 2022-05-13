import {
  near,
  BigInt,
  json,
  JSONValueKind,
  log,
  bigInt,
} from "@graphprotocol/graph-ts";
import { Contribution, Proposal, ProposalMetadata } from "../generated/schema";

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
      log.info(outcome.logs[0], []);
      let jsonDataProposal = outcome.logs[0];
      let parsedJSONProposal = json.fromString(jsonDataProposal);
      let id = "";
      let owner = "";
      let status = "";
      let image = "";

      let jsonDataProposalMetadata = outcome.logs[1];
      let parsedJSONProposalMetadata = json.fromString(jsonDataProposalMetadata);
      let metadata_id = ""
      let title = ""
      let description = ""
      let goal = ""
      let init_date = ""
      let finish_date = ""
      let funds = ""
      //let images:string[] = []
      let institution_link = ""
      let pensum_link = ""


      if(parsedJSONProposalMetadata.kind == JSONValueKind.OBJECT){
        let entry = parsedJSONProposalMetadata.toObject();

        for(let i = 0; i < entry.entries.length; i ++) {
          let key = entry.entries[i].key.toString();
          log.info("key:{}", [key]);

          switch(true) {
            case key == "id": 
              metadata_id = entry.entries[i].value.toString();
              break
            case key == "title":
              title = entry.entries[i].value.toString();
              break
            case key == "description":
              description = entry.entries[i].value.toString();
              break
            case key == "goal":
              goal = entry.entries[i].value.toI64().toString();
              break
            case key == "init_date":
              init_date = entry.entries[i].value.toI64().toString();
              break
            case key == "finish_date":  
              finish_date = entry.entries[i].value.toI64().toString();
              break
            case key == "funds":
              funds = entry.entries[i].value.toI64().toString();
              break
            // case key == "images":
            //   let images_arr:String[] = [];
            //   let images_par = entry.entries[i].value.toArray()
            //   for(let j = 0; images_par.length; j ++){
            //     images_arr.push(images_par[j].toString());
            //   }
            //   images = images_arr;
            //   break
            case key == "insitution_link":
              institution_link = entry.entries[i].value.toString();
              break
            case key == "pensum_link":
              pensum_link = entry.entries[i].value.toString();
              break
          }
        }
      }

      let proposalMetadata = new ProposalMetadata(metadata_id);
      proposalMetadata.id = metadata_id;
      proposalMetadata.title = title;
      proposalMetadata.description = description;
      proposalMetadata.goal = BigInt.fromString(goal);
      proposalMetadata.init_date = BigInt.fromString(init_date);
      proposalMetadata.finish_date = BigInt.fromString(finish_date);
      proposalMetadata.funds = BigInt.fromString(funds);
     // proposalMetadata.images = images;
      proposalMetadata.institution_link = institution_link;
      proposalMetadata.pensum_link = pensum_link;
      proposalMetadata.save();
      log.info("Proposal Metadata saved", []);
      log.info("Proposal ID creado ahora mismo mi pana es este"+proposalMetadata.id, []);


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

      let proposal = new Proposal(id);
      proposal.id = id;
      proposal.owner = owner;
      proposal.status = BigInt.fromString(status);
      proposal.image = image
      proposal.save();
      log.info("Proposal saved", []);
    }
  }



