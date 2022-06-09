import {
  near,
  BigInt,
  json,
  JSONValueKind,
  log,
  bigInt,
  JSONValue,
  BigDecimal,
} from "@graphprotocol/graph-ts";
import { Contribution, Proposal, Container } from "../generated/schema";

const percent = BigInt.fromString("100");

function get_percentage_to_reach_goal(funds: BigInt, goal: BigInt): BigInt {
  let percentage = funds.times(BigInt.fromI64(100)).div(goal);
  return percentage;
}

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
    let images: JSONValue[] = [];
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
          case key == "images":
            images = entry.entries[i].value.toArray();
        }
      }
    }

    let images_string: string[] = [];

    for (let k = 0; k < images.length; k++) {
      images_string.push(images[k].toString());
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
    container.images = images_string;

    let proposal = new Proposal(id);
    proposal.id = id;
    proposal.owner = owner;
    proposal.status = BigInt.fromString(status);
    proposal.image = images_string[0];
    proposal.percentage_for_reach_goal = "0";

    proposal.save();
    container.save();
    log.info("Proposal saved", []);
  }

  //CONTRIBUTION CREATION TRIGGER
  //ALSO IS NEEDED TO UPDATE THE FUNDS AMOUNT IN PROPOSALS WHEN THEY'VE BEEN FUNDING
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
            amount = entry.entries[i].value.toString();
            break;
          case key == "image":
            image = entry.entries[i].value.toString();
        }
      }
    }

    let container = Container.load(proposal_id);
    if (container) {
      let added_funds = BigInt.fromString(container.funds).plus(
        BigInt.fromString(amount)
      );
      container.funds = added_funds.toString();
      container.save();

      let proposal = Proposal.load(proposal_id);
      if (proposal) {
        let funds_per_100 = BigDecimal.fromString(container.funds);
        let percentage = funds_per_100.div(BigDecimal.fromString(container.goal));
        let percentage_string = percentage.toString();

        proposal.percentage_for_reach_goal = percentage_string ;
        proposal.save();
      } else {
        log.info("proposal no encontrado", []);
      }
    } else {
      log.info("Container No encontrado", []);
    }

    let contribution = new Contribution(id);
    contribution.id = id;
    contribution.from = from;
    contribution.to = to;
    contribution.proposal_id = proposal_id;
    contribution.amount = amount;
    contribution.image = image;
    contribution.save();
  }
}
