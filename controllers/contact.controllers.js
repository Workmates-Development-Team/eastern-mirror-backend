import contactModels from "../models/contact.models.js";

class ContactController {
  static async update(req, res) {
    try {
      const {
        letterToEditor,
        adQuery,
        ePaperQuery,
        customerCare,
        officeAddress,
        refundsQueries,
      } = req.body;

      if (
        !letterToEditor ||
        !adQuery ||
        !ePaperQuery ||
        !customerCare ||
        !officeAddress ||
        !refundsQueries
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const existingContact = await contactModels.findOne();

      if (existingContact) {
        existingContact.letterToEditor = letterToEditor;
        existingContact.adQuery = adQuery;
        existingContact.ePaperQuery = ePaperQuery;
        existingContact.customerCare = customerCare;
        existingContact.officeAddress = officeAddress;
        existingContact.refundsQueries = refundsQueries;

        await existingContact.save();
        return res
          .status(200)
          .json({ message: "Contact updated successfully" });
      } else {
        const newContact = new contactModels({
          letterToEditor,
          adQuery,
          ePaperQuery,
          customerCare,
          officeAddress,
          refundsQueries,
        });

        await newContact.save();
        return res
          .status(201)
          .json({ message: "Contact created successfully" });
      }
    } catch (error) {
        console.log(error)
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async get(req, res) {
    try {
      const contact = await contactModels.findOne();

      if (!contact) {
        return res.status(404).json({ message: "No contact settings found" });
      }

      res.status(200).json({
        message: "Contact setting retrieved successfully",
        contact,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default ContactController;
