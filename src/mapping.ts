import { Publish } from "./types/ethvindexv1/EthVIndexV1"
import { Index, Update } from "./types/schema"
import { BigInt, BigDecimal } from '@graphprotocol/graph-ts'

const BigIntOne =  BigInt.fromI32(1)
const BigIntZero =  BigInt.fromI32(0)
const ethvAddr = '0xe10bF493577B11f2161b7505b6a707186BFB6208'


export function handlePublish(event: Publish): void {
    let ethv = Index.load(ethvAddr)
    if (ethv == null) {
        ethv = new Index(ethvAddr)
        ethv.name = 'ETHV'
        ethv.latestUpdate = null
        ethv.numUpdates = BigIntZero
        
        ethv.save()
    }

    let update = new Update(event.transaction.hash.toHexString().toString());

    update.blocknumber = event.block.number;
    update.timestamp = event.block.timestamp;
    update.value = BigDecimal.fromString(event.params.ethv);
    update.index = ethv.id;
    update.save();

    ethv.numUpdates = ethv.numUpdates + BigIntOne
    ethv.latestUpdate = update.id
    ethv.save()
}