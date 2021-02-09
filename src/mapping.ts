import { Publish } from '../generated/ETHV'
import { ETHV, ethvUpdate } from '../generated/schema'
import { BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'

const BigIntOne =  BigInt.fromI32(1)
const BigIntZero =  BigInt.fromI32(0)

function isIndex(address: string): boolean {
    let oToken = ETHV.load(address)
    return oToken != null
}


export function handlePublish(event: Publish): void {
    let index = VolmexIndex.bind(event.address)
    let indexAddr = index.tokenAddress().toHexString().toString()

    if (!isIndex(indexAddr)) {
        return
    }

    let ethv = ETHV.load(indexAddr)
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