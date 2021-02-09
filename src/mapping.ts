import { Publish } from '../generated/ETHV'
import { ETHV, ethvUpdate } from '../generated/schema'
import { BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'

const BigIntOne =  BigInt.fromI32(1)
const BigIntZero =  BigInt.fromI32(0)
const ethvAddr = '0xe10bF493577B11f2161b7505b6a707186BFB6208'


export function handlePublish(event: Publish): void {
    let ethv = ETHV.load(ethvAddr)
    if (ethv === null) {
        ethv = new ETHV()
        ethv.latestUpdate = null
        ethv.updates = []
        ethv.numUpdates = BigIntZero
        return ethv
    }

    let update = new ethvUpdate(event.params.id.toHex());

    update.blocknumber = event.block.number;
    update.timestamp = event.block.timestamp;
    update.ethv = event.params.ethv;
    update.save();

    ethv.numUpdates = ethv.numUpdates + BigIntOne
    let updates = ethv.updates
    updates.push(update.id)
    ethv.updates = updates
    ethv.latestUpdate = update.id
    ethv.save()
}