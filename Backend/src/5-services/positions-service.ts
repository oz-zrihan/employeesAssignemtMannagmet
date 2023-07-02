import { ResourceNotFoundError, ValidationError } from "../2-models/client-errors";
import PositionModel, { IPositionModel } from "../2-models/position-model";


// Get all positions from database: 
async function getAllPositions(): Promise<(IPositionModel)[]> {
  return PositionModel.find().populate('department').exec();    
  }

// Get one position
async function getOnePositions(_id: string): Promise<IPositionModel> {
        
    const product = await PositionModel.findById(_id).populate('department').exec();
        
        // Validate position id exists:
        if (!product) throw new ResourceNotFoundError(_id);

        return product;
}

// Add position
async function addPositions(position: IPositionModel): Promise<IPositionModel> {
    
    // Validate position:
    const errors = position.validateSync();
    if(errors) throw new ValidationError(errors.message);

    return position.save();
}

// Delete position
async function deletePosition(_id: string): Promise<void> {
   
    const position = await PositionModel.findById(_id).exec();
    
    // Validate position id exists:
    if (!position) throw new ResourceNotFoundError(_id);
    
    const deletePosition = await PositionModel.findByIdAndDelete(_id).exec();

    // Validate deleted position:
    if(!deletePosition) throw new ResourceNotFoundError(_id);
}



export default {
   getAllPositions,
   getOnePositions,
   addPositions,
   deletePosition
};
